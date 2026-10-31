import z from 'zod';

export const customFieldValueSchema = z.union([
  z.number(),
  z.string(),
  z.boolean(),
]);

export const customFieldValuesFormSchema = z.union([
  z.record(
    z.number(),
    z
      .object({
        id: z.number().min(1),
        valueBoolean: z.boolean().nullable(),
        valueNumber: z.number().nullable(),
        valueText: z.string().nullable(),
      })
      .optional(),
  ),
]);
