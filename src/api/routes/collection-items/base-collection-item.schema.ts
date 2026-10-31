import z from 'zod';

import { customFieldValuesFormSchema } from '../custom-field-values/custom-field-values.schema';

export const baseCollectionItemSchema = z.object({
  collectionId: z.number().min(1),
  customFieldValues: customFieldValuesFormSchema,
  editionDetails: z.string(),
  isSpecialEdition: z.boolean(),
  name: z.string().min(1),
  notes: z.string(),
});

const imagesBaseSchema = {
  newImageDetails: z.object({
    file: z.file(),
    previewUrl: z.string(),
  }),
  publicId: z.string(),
};

export const imagesSchema = {
  ...imagesBaseSchema,
  filesList: z.array(imagesBaseSchema.newImageDetails),
  filesOrPublicIdsList: z.array(
    z.union([imagesBaseSchema.publicId, imagesBaseSchema.newImageDetails]),
  ),
  publicIdsList: z.array(imagesBaseSchema.publicId),
};
