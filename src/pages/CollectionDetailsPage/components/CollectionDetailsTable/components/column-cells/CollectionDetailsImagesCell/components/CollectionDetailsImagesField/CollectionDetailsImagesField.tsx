import { Field } from '@base-ui/react';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import AddIcon from '@mui/icons-material/Add';

import {
  createCloudinaryUrl,
  thumbnailSize,
} from '#/api/routes/cloudinary/cloudinary-url';
import { FieldWrapper } from '#/components/Fields/FieldWrapper';
import { SimpleErrorBoundary } from '#/components/SimpleErrorBoundary';

import type { CollectionDetailsImagesFieldPropsDef } from './CollectionDetailsImagesField.types';

import { SortableThumbnail } from './components/SortableThumbnail';

export const CollectionDetailsImagesField = (
  props: CollectionDetailsImagesFieldPropsDef,
) => {
  const { form, rowIndex } = props;

  return (
    <form.ArrayField name={`collectionItems[${rowIndex}].images`}>
      {(field) => {
        return field.value ? (
          <>
            <DragDropProvider
              onDragEnd={(event) => {
                if (event.canceled) return;

                const { source } = event.operation;

                if (isSortable(source)) {
                  const { index, initialIndex } = source;

                  if (initialIndex !== index) {
                    const newItems = [...field.value];
                    const [removed] = newItems.splice(initialIndex, 1);
                    newItems.splice(index, 0, removed);

                    field.handleChange(newItems);
                  }
                }
              }}
            >
              {field.value.map((image, index) => {
                let publicId = '';
                let previewUrl = '';

                if (typeof image === 'string') {
                  publicId = image;
                } else {
                  previewUrl = image.previewUrl;
                }

                const src =
                  previewUrl ||
                  createCloudinaryUrl({
                    height: thumbnailSize,
                    publicId,
                    width: thumbnailSize,
                  });

                return (
                  <SortableThumbnail
                    altText={`${field.name} thumbnail ${index + 1}`}
                    index={index}
                    key={src}
                    onDelete={() => {
                      field.removeValue(index);
                    }}
                    src={src}
                  />
                );
              })}
            </DragDropProvider>

            <SimpleErrorBoundary>
              <FieldWrapper className="relative grid items-center justify-center size-18 border border-theme-divider-3 rounded-2xl bg-theme-surface-2 text-theme-t2 hover:border-theme-link-hover hover:text-theme-link-hover cursor-pointer">
                <AddIcon fontSize="large" />
                <Field.Control
                  accept="image/*"
                  capture="environment"
                  className="absolute size-full cursor-pointer text-transparent"
                  multiple
                  name={field.name}
                  onChange={async (event) => {
                    const selectedFiles = event?.target?.files || [];

                    const files = [...selectedFiles].map((file) => {
                      return {
                        file,
                        previewUrl: URL.createObjectURL(file),
                      };
                    });

                    return field.handleChange([...field.value, ...files]);
                  }}
                  placeholder="Input name..."
                  type="file"
                />
              </FieldWrapper>
            </SimpleErrorBoundary>
          </>
        ) : null;
      }}
    </form.ArrayField>
  );
};
