import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';

import type z from '../../../../../node_modules/zod/v4/classic/external.d.cts';
import type { getCollectionStatsByIdDbQuery } from './get-collection-stats-by-id.db-query';
import type { getCollectionStatsByIdSchema } from './get-collection-stats-by-id.schema';

export type GetCollectionStatsByIdRequestArgsDef = z.output<
  typeof getCollectionStatsByIdSchema
>;

export type GetCollectionStatsByIdResponseDef = QueryResponseDef<
  typeof getCollectionStatsByIdDbQuery
>;
