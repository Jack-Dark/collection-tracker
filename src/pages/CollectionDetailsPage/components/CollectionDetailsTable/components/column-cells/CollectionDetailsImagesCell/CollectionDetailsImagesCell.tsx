import type { BaseImagePropsDef } from '#/components/Image/Images.types';
import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { thumbnailSize } from '#/api/routes/cloudinary/cloudinary-url';
import { EmptyCellValue } from '#/components/Table/components/EmptyCellValue';
import { ZoomableThumbnailGallery } from '#/components/ZoomableThumbnailGallery';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

import { CollectionDetailsImagesField } from './components/CollectionDetailsImagesField';

/** `children` should be the editing field view. */
export const CollectionDetailsImagesCell = (props: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
}) => {
  const { form, rowId, rowIndex } = props;

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  return (
    <div className="flex flex-wrap gap-1 items-end min-w-45">
      {isEditingRow ? (
        <CollectionDetailsImagesField form={form} rowIndex={rowIndex} />
      ) : (
        <form.Field name={`collectionItems[${rowIndex}].name`}>
          {(nameField) => {
            return (
              <form.Field name={`collectionItems[${rowIndex}].images`}>
                {(imagesField) => {
                  if (!imagesField.value) {
                    return null;
                  }
                  const formattedImages = imagesField.value.map((data) => {
                    const isPublicId = typeof data === 'string';

                    const image: BaseImagePropsDef = isPublicId
                      ? {
                          cropMode: 'limit',
                          height: 1000,
                          publicId: data,
                          transformations: ['f_auto,q_auto'],
                          width: 1000,
                        }
                      : { src: data.previewUrl };

                    return image;
                  });

                  return imagesField.value.length ? (
                    <>
                      {imagesField.value.map((data, index) => {
                        const isPublicId = typeof data === 'string';

                        const key: string = isPublicId ? data : data.previewUrl;

                        const thumbnail: BaseImagePropsDef = isPublicId
                          ? {
                              cropMode: 'auto',
                              height: thumbnailSize,
                              publicId: data,
                              transformations: ['f_auto,q_auto'],
                              width: thumbnailSize,
                            }
                          : { src: data.previewUrl };

                        return (
                          <div
                            className="p-1 size-14 border border-theme-divider-3 bg-theme-surface-2 text-theme-t2 hover:border-theme-link-hover hover:text-theme-link-hover rounded-2xl overflow-hidden"
                            key={key}
                          >
                            <ZoomableThumbnailGallery
                              alt={`${nameField.value} image`}
                              className="rounded-xl overflow-hidden"
                              images={formattedImages}
                              index={index}
                              thumbnail={thumbnail}
                            />
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <EmptyCellValue />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Field>
      )}
    </div>
  );
};
