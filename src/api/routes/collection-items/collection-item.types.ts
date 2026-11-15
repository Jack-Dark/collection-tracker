import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type z from 'zod';

import type { collectionItemsTable } from '../../db/db-tables-schema';
import type { imagesSchema } from './base-collection-item.schema';

export type CollectionItemRecordDef = InferSelectModel<
  typeof collectionItemsTable
>;

export type InsertCollectionItemRecordDef = InferInsertModel<
  typeof collectionItemsTable
>;

export type CollectionItemsTableColumn = keyof CollectionItemRecordDef;

export type ImagesFilesListSchemaDef = z.output<typeof imagesSchema.filesList>;

export type FormImagesSchemaDef = z.output<
  typeof imagesSchema.filesOrPublicIdsList
>;
