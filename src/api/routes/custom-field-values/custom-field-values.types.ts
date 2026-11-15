import type z from 'zod';

import type {
  customFieldValueBooleanSchema,
  customFieldValueNumberSchema,
  customFieldValueSchema,
  customFieldValuesFormSchema,
  customFieldValueStringSchema,
} from './custom-field-values.schema';

export type CustomFieldValuesByFieldId = z.output<
  typeof customFieldValuesFormSchema
>;

export type CustomFieldValueBooleanDef = z.output<
  typeof customFieldValueBooleanSchema
>;

export type CustomFieldValueNumberDef = z.output<
  typeof customFieldValueNumberSchema
>;

export type CustomFieldValueStringDef = z.output<
  typeof customFieldValueStringSchema
>;

export type CustomFieldValueDef = z.output<typeof customFieldValueSchema>;
