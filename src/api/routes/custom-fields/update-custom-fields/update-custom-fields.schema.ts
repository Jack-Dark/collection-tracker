import z from 'zod';

import { customFieldWithIdSchema } from '../custom-fields.schema';

export const updateCustomFieldsSchema = z.object({
  records: z.array(customFieldWithIdSchema).min(1),
});
