import z from 'zod';

import {
  getOptionalPaginationQueriesSchema,
  getPaginationQueryDefaults,
} from '#/api/pagination/pagination.schema';

import type { CustomFieldColumnDef } from '../custom-fields.types';

const defaultSortField: CustomFieldColumnDef = 'name';

export const getCustomFieldsSchema = z
  .object({
    ids: z
      .array(z.number().min(1))
      .optional()
      .default([]),
    params:
      getOptionalPaginationQueriesSchema<CustomFieldColumnDef>(
        defaultSortField,
      ),
  })
  .optional()
  .default({ ids: [], params: getPaginationQueryDefaults(defaultSortField) });
