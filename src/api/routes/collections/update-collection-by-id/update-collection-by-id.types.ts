import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { updateCollectionByIdDbQuery } from './update-collection-by-id.db-query';
import type {
  onUpdateCollectionsArgsSchema,
  updateCollectionsFormRecordSchema,
} from './update-collection-by-id.schema';

export type UpdateCollectionsFormRecordSchemaDef = z.output<
  typeof updateCollectionsFormRecordSchema
>;

export type OnUpdateCollectionsArgsDef = z.output<
  typeof onUpdateCollectionsArgsSchema
>;

export type UpdateCollectionByIdResponseDef = QueryResponseDef<
  typeof updateCollectionByIdDbQuery
>;
