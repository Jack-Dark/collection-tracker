import z from 'zod';

export const getCollectionStatsByIdSchema = z.object({
  collectionId: z.number(),
});
