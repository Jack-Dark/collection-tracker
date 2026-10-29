import type z from 'zod';

import type { sendAccountDeletedEmailSchema } from './send-account-deleted-email.schema';

export type SendAccountDeletedEmailRequestArgs = z.output<
  typeof sendAccountDeletedEmailSchema
>;
