import z from 'zod';

import { updateCustomFieldFormSchema } from '../../custom-fields/custom-fields.schema';
import { baseCollectionSchema } from '../base-collection.schema';

export const createCollectionFormSchema = baseCollectionSchema.extend({
  createdAt: z.undefined().optional(),
  customFields: z.array(updateCustomFieldFormSchema),
  id: z.string(),
  updatedAt: z.undefined().optional(),
});

export const createCollectionServerFnSchema = z.object({
  records: z
    .array(
      createCollectionFormSchema.omit({
        createdAt: true,
        id: true,
        updatedAt: true,
      }),
    )
    .min(1),
});
