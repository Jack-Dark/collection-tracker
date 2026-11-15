import type z from 'zod';

import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth.types';

import type { createCollectionItemsDbQuery } from './create-collection-item.db-query';
import type {
  createCollectionItemsFormSchema,
  createCollectionItemsServerFnSchema,
  createCollectionItemsWithFileImagesSchema,
} from './create-collection-item.schema';

export type CreateCollectionItemsFormDataSchemaDef = z.output<
  typeof createCollectionItemsFormSchema
>;

export type CreateCollectionItemsRequestArgsDef = z.output<
  typeof createCollectionItemsWithFileImagesSchema
>;

export type CreateCollectionItemsDbQueryArgsDef = DbQueryArgsDef<
  z.output<typeof createCollectionItemsServerFnSchema>
>;

export type CreateCollectionItemsResponseDef = QueryResponseDef<
  typeof createCollectionItemsDbQuery
>;
