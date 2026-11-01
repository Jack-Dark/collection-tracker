import z from 'zod';

import { updateCustomFieldFormSchema } from '../../custom-fields/custom-fields.schema';
import { baseCollectionSchema } from '../base-collection.schema';

export const updateCollectionsFormRecordSchema = baseCollectionSchema.extend({
  createdAt: z.date().min(1),
  customFields: z.array(updateCustomFieldFormSchema),
  id: z.number().min(1),
  updatedAt: z.date().min(1),
});

export const onUpdateCollectionsArgsSchema = z.object({
  records: z.array(updateCollectionsFormRecordSchema),
});
