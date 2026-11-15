import type z from 'zod';

import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';

import type { createCollectionDbQuery } from './create-collection.db-query';
import type {
  createCollectionFormSchema,
  createCollectionServerFnSchema,
} from './create-collection.schema';

export type CreateCollectionFormDataSchemaDef = z.output<
  typeof createCollectionFormSchema
>;

export type CreateCollectionRequestArgsDef = z.output<
  typeof createCollectionServerFnSchema
>;

export type CreateCollectionResponseDef = QueryResponseDef<
  typeof createCollectionDbQuery
>;
