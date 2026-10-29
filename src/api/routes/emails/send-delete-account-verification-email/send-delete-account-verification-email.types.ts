import type z from 'zod';

import type { sendDeleteAccountVerificationEmailSchema } from './send-delete-account-verification-email.schema';

export type SendDeleteAccountVerificationEmailRequestArgs = z.output<
  typeof sendDeleteAccountVerificationEmailSchema
>;
