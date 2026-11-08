import type z from 'zod';

import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';

import type { updateCustomFieldsDbQuery } from './update-custom-fields.db-query';
import type { updateCustomFieldsSchema } from './update-custom-fields.schema';

export type UpdateCustomFieldsRequestArgsDef = z.output<
  typeof updateCustomFieldsSchema
>;

export type UpdateCustomFieldsResponseDef = QueryResponseDef<
  typeof updateCustomFieldsDbQuery
>;
