import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { getNumCollectionsWithCustomFieldDbQuery } from './get-num-collections-with-custom-field.db-query';
import type { getNumCollectionsWithCustomFieldSchema } from './get-num-collections-with-custom-field.schema';

export type GetNumCollectionsWithCustomFieldRequestArgsDef = z.output<
  typeof getNumCollectionsWithCustomFieldSchema
>;

export type GetNumCollectionsWithCustomFieldResponseDef = QueryResponseDef<
  typeof getNumCollectionsWithCustomFieldDbQuery
>;
