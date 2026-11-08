import type z from 'zod';

import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';

import type { getCustomFieldValuesByCustomFieldIdDbQuery } from './get-custom-field-values-by-collection-id.db-query';
import type { getCustomFieldValuesByCustomFieldIdSchema } from './get-custom-field-values-by-collection-id.schema';

export type GetCustomFieldValuesByCustomFieldIdRequestArgsDef = z.output<
  typeof getCustomFieldValuesByCustomFieldIdSchema
>;

export type GetCustomFieldValuesByCustomFieldIdResponseDef = QueryResponseDef<
  typeof getCustomFieldValuesByCustomFieldIdDbQuery
>;
