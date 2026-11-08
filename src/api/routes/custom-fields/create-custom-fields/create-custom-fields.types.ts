import type z from 'zod';

import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';

import type { createCustomFieldsDbQuery } from './create-custom-fields.db-query';
import type { createCustomFieldsSchema } from './create-custom-fields.schema';

export type CreateCustomFieldsRequestArgsDef = z.output<
  typeof createCustomFieldsSchema
>;

export type CreateCustomFieldsResponseDef = QueryResponseDef<
  typeof createCustomFieldsDbQuery
>;
