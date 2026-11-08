import type { InferSelectModel } from 'drizzle-orm';

import type { collectionsTable } from '../../db/db-tables-schema';

export type CollectionRecordDef = InferSelectModel<typeof collectionsTable>;

export type CollectionTableColumnsDef = keyof CollectionRecordDef;
