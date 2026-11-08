import type { InferSelectModel } from 'drizzle-orm';

import type { customFieldsTable } from '#/api/db/db-tables-schema';

import type z from '../../../../node_modules/zod/v4/classic/external.d.cts';
import type {
  baseCustomFieldSchema,
  customFieldFormSchema,
} from './custom-fields.schema';

export type BaseCustomFieldSchemaDef = z.output<typeof baseCustomFieldSchema>;

export type CustomFieldRecordDef = InferSelectModel<typeof customFieldsTable>;

export type CustomFieldColumnDef = keyof CustomFieldRecordDef;

export type CustomFieldFormSchemaDef = z.output<typeof customFieldFormSchema>;
