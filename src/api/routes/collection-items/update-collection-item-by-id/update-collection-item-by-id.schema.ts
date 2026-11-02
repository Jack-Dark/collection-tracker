import z from 'zod';

import {
  baseCollectionItemSchema,
  imagesSchema,
} from '../base-collection-item.schema';

const updateCollectionItemsBaseSchema = baseCollectionItemSchema.extend({
  createdAt: z.date().min(1),
  id: z.number().min(1),
  updatedAt: z.date().min(1),
});

export const updateCollectionItemsFormSchema =
  updateCollectionItemsBaseSchema.extend({
    images: imagesSchema.filesOrPublicIdsList,
  });

export const onUpdateCollectionItemsArgsSchema =
  updateCollectionItemsBaseSchema.extend({
    images: imagesSchema.filesOrPublicIdsList,
  });

export const updateCollectionItemsServerFnSchema = z.object({
  records: z.array(
    updateCollectionItemsBaseSchema.extend({
      images: imagesSchema.publicIdsList,
    }),
  ),
  uploadedPublicIds: z.array(z.array(z.string())),
});
