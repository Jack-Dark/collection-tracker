import z from 'zod';

export const customFieldBaseValueSchema = z.union([
  z.number(),
  z.string(),
  z.boolean(),
]);

export const customFieldValueBooleanSchema = z.object({
  id: z.number().min(1),
  valueBoolean: z.boolean(),
  valueNumber: z.null(),
  valueText: z.null(),
});

export const customFieldValueNumberSchema = z.object({
  id: z.number().min(1),
  valueBoolean: z.null(),
  valueNumber: z.number(),
  valueText: z.null(),
});

export const customFieldValueStringSchema = z.object({
  id: z.number().min(1),
  valueBoolean: z.null(),
  valueNumber: z.null(),
  valueText: z.string(),
});

export const customFieldValueSchema = z.union([
  customFieldValueBooleanSchema,
  customFieldValueNumberSchema,
  customFieldValueStringSchema,
]);

export const customFieldValuesFormSchema = z.union([
  z.record(z.number(), customFieldValueSchema.optional()),
]);
