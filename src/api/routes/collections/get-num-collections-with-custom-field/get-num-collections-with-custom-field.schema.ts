import z from 'zod';

export const getNumCollectionsWithCustomFieldSchema = z.object({
  customFieldId: z.number().min(1),
});
