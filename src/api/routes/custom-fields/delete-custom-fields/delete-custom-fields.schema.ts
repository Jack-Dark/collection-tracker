import z from 'zod';

export const deleteCustomFieldsSchema = z.object({
  ids: z.array(z.number()).min(1),
});
