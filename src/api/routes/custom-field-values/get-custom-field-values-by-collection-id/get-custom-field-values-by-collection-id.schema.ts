import z from 'zod';

export const getCustomFieldValuesByCustomFieldIdSchema = z.object({
  id: z.number().min(1),
});
