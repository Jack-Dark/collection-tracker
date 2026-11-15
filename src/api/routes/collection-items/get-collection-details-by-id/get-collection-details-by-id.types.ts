import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';

import type z from '../../../../../node_modules/zod/v4/classic/external.d.cts';
import type { getCollectionDetailsByIdDbQuery } from './get-collection-details-by-id.db-query';
import type {
  collectionDetailsFiltersSchema,
  getCollectionDetailsByIdSchema,
} from './get-collection-details-by-id.schema';

export type CollectionDetailsFiltersSchemaDef = z.output<
  typeof collectionDetailsFiltersSchema
>;

export type GetCollectionDetailsByIdRequestArgsDef = z.output<
  typeof getCollectionDetailsByIdSchema
>;

export type GetCollectionDetailsByIdResponseDef = QueryResponseDef<
  typeof getCollectionDetailsByIdDbQuery
>;
