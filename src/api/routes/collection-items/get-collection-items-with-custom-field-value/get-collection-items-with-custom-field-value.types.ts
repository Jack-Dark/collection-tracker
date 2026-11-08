import type z from 'zod';

import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';

import type { getCollectionItemsWithCustomFieldValueDbQuery } from './get-collection-items-with-custom-field-value.db-query';
import type { getCollectionItemsWithCustomFieldValueSchema } from './get-collection-items-with-custom-field-value.schema';

export type GetCollectionItemsWithCustomFieldValueRequestArgsDef = z.output<
  typeof getCollectionItemsWithCustomFieldValueSchema
>;

export type GetCollectionItemsWithCustomFieldValueResponseDef =
  QueryResponseDef<typeof getCollectionItemsWithCustomFieldValueDbQuery>;
