import type z from 'zod';

import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';

import type { deleteCollectionDbQuery } from './delete-collection-by-id.db-query';
import type { deleteCollectionsByIdsSchema } from './delete-collection-by-id.schema';

export type DeleteCollectionByIdRequestArgsDef = z.output<
  typeof deleteCollectionsByIdsSchema
>;

export type DeleteCollectionResponseDef = QueryResponseDef<
  typeof deleteCollectionDbQuery
>;
