import type { BaseImagePropsDef } from '#/components/Image/Images.types';
import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { thumbnailSize } from '#/api/routes/cloudinary/cloudinary-url';
import { ZoomableThumbnailGallery } from '#/components/ZoomableThumbnailGallery/ZoomableThumbnailGallery';
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
                  const formattedImages = imagesField.value.map((data) => {
                    const isPublicId = typeof data === 'string';

                    const image: BaseImagePropsDef = isPublicId
                      ? { publicId: data }
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
                              cropMode: 'pad',
                              height: thumbnailSize,
                              publicId: data,
                              width: thumbnailSize,
                            }
                          : { src: data.previewUrl };

                        return (
                          <div
                            className="p-1 size-14 border border-theme-divider-3 bg-theme-surface-2 text-theme-t2 hover:border-theme-link-hover hover:text-theme-link-hover"
                            key={key}
                          >
                            <ZoomableThumbnailGallery
                              alt={`${nameField.value} image`}
                              images={formattedImages}
                              index={index}
                              thumbnail={thumbnail}
                            />
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p>-</p>
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
