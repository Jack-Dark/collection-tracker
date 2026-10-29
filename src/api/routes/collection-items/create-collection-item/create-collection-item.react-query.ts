import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  CreateCollectionItemsResponseDef,
  CreateCollectionItemsRequestArgsDef,
} from './create-collection-item.types';

import { deleteCloudinaryAssetsByPublicIdsServerFn } from '../../cloudinary/delete-cloudinary-assets-by-pubic-ids';
import { uploadFileToCloudinary } from '../../cloudinary/helpers/upload-file-to-cloudinary';
import { createCollectionItemServerFn } from './create-collection-item.serverFn';

export const useCreateCollectionItems = <
  TTransformedData = CreateCollectionItemsResponseDef,
>(
  props?: GenericMutateQueryProps<
    CreateCollectionItemsRequestArgsDef[],
    CreateCollectionItemsResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onCreateCollectionItem, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to add item(s) to collection.',
    mutationFn: async (formRecords) => {
      let uploadedPublicIds: string[][] = [];

      try {
        // ? upload images to Cloudinary
        // ? Currently not possible to do via server function except via form data, which is not ideal for bulk uploads:
        // ? https://github.com/TanStack/router/issues/5704
        // ? https://www.answeroverflow.com/m/1433076253208084571
        uploadedPublicIds = await Promise.all(
          formRecords.map(async ({ images }) => {
            return Promise.all(
              images.map(async (image) => {
                const { public_id } = await uploadFileToCloudinary({
                  file: image.file,
                });

                return public_id;
              }),
            );
          }),
        );

        // ? format record with images
        const recordsWithImages = formRecords.map((record, index) => {
          const images = uploadedPublicIds[index];

          return { ...record, images };
        });

        return createCollectionItemServerFn({
          data: {
            publicIds: uploadedPublicIds,
            records: recordsWithImages,
          },
        });
      } catch (error) {
        // ? Delete uploaded files if error
        await deleteCloudinaryAssetsByPublicIdsServerFn({
          data: { publicIds: uploadedPublicIds.flat() },
        });

        throw error;
      }
    },
    mutationKey: [reactMutationKeys.collectionItems.create],
    ...props,
  });

  return { ...rest, onCreateCollectionItem };
};
