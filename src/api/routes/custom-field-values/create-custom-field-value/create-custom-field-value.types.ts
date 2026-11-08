import type z from 'zod';

import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';

import type { createCustomFieldValuesDbQuery } from './create-custom-field-value.db-query';
import type { createCustomFieldValuesSchema } from './create-custom-field-value.schema';

export type CreateCustomFieldValuesRequestArgsDef = z.output<
  typeof createCustomFieldValuesSchema
>;

export type CreateCustomFieldValuesResponseDef = QueryResponseDef<
  typeof createCustomFieldValuesDbQuery
>;
