import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import z from 'zod';

import type { collectionsTable } from '#/api/db/db-tables-schema';

export const baseCollectionSchema = z.object({
  name: z.string().min(1),
  notes: z.string(),
});

export type CollectionRecordDef = InferSelectModel<typeof collectionsTable>;

export type InsertCollectionRecordDef = InferInsertModel<
  typeof collectionsTable
>;
