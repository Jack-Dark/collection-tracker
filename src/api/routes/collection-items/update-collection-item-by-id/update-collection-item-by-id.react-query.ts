import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  OnUpdateCollectionItemsArgsDef,
  UpdateCollectionItemsResponseDef,
} from './update-collection-item-by-id.types';

import { deleteCloudinaryAssetsByPublicIdsServerFn } from '../../cloudinary/delete-cloudinary-assets-by-pubic-ids';
import { uploadFileToCloudinary } from '../../cloudinary/helpers/upload-file-to-cloudinary';
import { updateCollectionItemsServerFn } from './update-collection-item-by-id.serverFn';

export const useUpdateCollectionItems = <
  TTransformedData = UpdateCollectionItemsResponseDef,
>(
  props?: GenericMutateQueryProps<
    OnUpdateCollectionItemsArgsDef[],
    UpdateCollectionItemsResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onUpdateCollectionItems, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to update collection item.',
    mutationFn: async (formRecords) => {
      const uploadedPublicIds: string[][] = [];

      try {
        // ? upload images to Cloudinary
        // ? Currently not possible to do via server function except via form data, which is not ideal for bulk uploads:
        // ? https://github.com/TanStack/router/issues/5704
        // ? https://www.answeroverflow.com/m/1433076253208084571
        const recordsWithImages = await Promise.all(
          formRecords.map(async (record) => {
            const { images } = record;

            const uploadedPublicIdsForRecord: string[] = [];

            const updatedImages = await Promise.all(
              images.map(async (image) => {
                if (typeof image === 'string') {
                  // ? return existing public ID
                  return image;
                } else {
                  // ? upload new file and return public ID
                  const { public_id } = await uploadFileToCloudinary({
                    file: image.file,
                  });

                  uploadedPublicIdsForRecord.push(public_id);

                  return public_id;
                }
              }),
            );

            uploadedPublicIds.push(uploadedPublicIdsForRecord);

            return { ...record, images: updatedImages };
          }),
        );

        return updateCollectionItemsServerFn({
          data: {
            records: recordsWithImages,
            uploadedPublicIds,
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
    mutationKey: [reactMutationKeys.collectionItems.update],
    ...props,
  });

  return { ...rest, onUpdateCollectionItems };
};
