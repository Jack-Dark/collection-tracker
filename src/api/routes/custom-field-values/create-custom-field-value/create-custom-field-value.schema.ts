import z from 'zod';

import { customFieldBaseValueSchema } from '../custom-field-values.schema';

export const createCustomFieldValuesSchema = z.object({
  records: z.array(
    z
      .object({
        customFieldId: z.number().min(1),
        value: customFieldBaseValueSchema,
      })
      .strict(),
  ),
});
