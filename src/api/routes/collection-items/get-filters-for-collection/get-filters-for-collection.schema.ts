import z from 'zod';

export const getFiltersForCollectionSchema = z.object({
  id: z.number().min(1),
});
