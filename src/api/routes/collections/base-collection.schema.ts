import z from 'zod';

export const baseCollectionSchema = z.object({
  name: z.string().min(1),
  notes: z.string(),
});
