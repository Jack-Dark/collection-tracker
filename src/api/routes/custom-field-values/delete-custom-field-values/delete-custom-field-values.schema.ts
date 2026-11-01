import z from 'zod';

export const deleteCustomFieldValuesSchema = z.object({
  collectionItemId: z.union([z.number().min(1), z.string().min(1)]),
  ids: z.array(z.number().min(1)).min(1),
});
