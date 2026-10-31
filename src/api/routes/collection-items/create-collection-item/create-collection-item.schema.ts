import z from 'zod';

import {
  baseCollectionItemSchema,
  imagesSchema,
} from '../base-collection-item.schema';

export const createCollectionItemsFormSchema = baseCollectionItemSchema.extend({
  id: z.string(),
  images: imagesSchema.filesList,
});

// ? Separate schema in order to upload images client-side
export const createCollectionItemsWithFileImagesSchema =
  baseCollectionItemSchema
    .extend({
      images: imagesSchema.filesList,
    })
    .strict();

// ? Handle the rest server-side with uploaded files public IDs
export const createCollectionItemsServerFnSchema = z.object({
  publicIds: z.array(z.array(z.string())),
  records: z.array(
    baseCollectionItemSchema
      .extend({
        images: imagesSchema.publicIdsList,
      })
      .strict(),
  ),
});
