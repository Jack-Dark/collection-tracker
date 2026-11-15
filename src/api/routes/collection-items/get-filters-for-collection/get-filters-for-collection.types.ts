import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';

import type z from '../../../../../node_modules/zod/v4/classic/external.d.cts';
import type { getFiltersForCollectionDbQuery } from './get-filters-for-collection.db-query';
import type { getFiltersForCollectionSchema } from './get-filters-for-collection.schema';

export type GetFiltersForCollectionRequestArgsDef = z.output<
  typeof getFiltersForCollectionSchema
>;

export type GetFiltersForCollectionResponseDef = QueryResponseDef<
  typeof getFiltersForCollectionDbQuery
>;
