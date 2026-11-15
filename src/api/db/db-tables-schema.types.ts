import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { NeonQueryResultHKT } from 'drizzle-orm/neon-serverless';
import type { PgAsyncTransaction } from 'drizzle-orm/pg-core';

import type {
  collectionItemsToCustomFieldValuesTable,
  collectionsToCustomFieldsTable,
  customFieldValuesTable,
  customFieldsTable,
  usersTable,
} from './db-tables-schema';
import type { relations } from './relations';

export type UserRecordDef = InferSelectModel<typeof usersTable>;

export type CreateNewUserRecordDef = InferInsertModel<typeof usersTable>;

/**
 * @example export type YOUR_RESPONSE_TYPE = QueryResponseDef<typeof YOUR_DB_QUERY_FUNCTION>;
 */
export type QueryResponseDef<TDbQuery extends (...args: any) => any> = Awaited<
  ReturnType<TDbQuery>
>;

export type InsertCustomFieldRecordDef = InferInsertModel<
  typeof customFieldsTable
>;

export type CustomFieldRecordDef = InferSelectModel<typeof customFieldsTable>;

export type InsertCustomFieldValueRecordDef = InferInsertModel<
  typeof customFieldValuesTable
>;

export type CustomFieldValueRecordDef = InferSelectModel<
  typeof customFieldValuesTable
>;

export type InsertLinkCollectionsToCustomFieldsRecordDef = InferInsertModel<
  typeof collectionsToCustomFieldsTable
>;

export type InsertLinkCollectionItemsToCustomFieldValuesRecordDef =
  InferInsertModel<typeof collectionItemsToCustomFieldValuesTable>;

export type TableTransactionDef = PgAsyncTransaction<
  NeonQueryResultHKT,
  typeof relations
>;

export type CustomFieldTypeDef = 'boolean' | 'number' | 'string';
