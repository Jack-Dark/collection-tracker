import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/auth/auth-middleware';

import { resend, resendEmailFrom } from '../resend.configs';
import { sendAccountDeletedEmailSchema } from './send-account-deleted-email.schema';
import { getVerificationEmailTemplateString } from './send-account-deleted-email.template';

export const sendAccountDeletedEmailServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(sendAccountDeletedEmailSchema)
  .handler(async ({ data }) => {
    const { email } = data;

    const { error } = await resend.emails.send({
      from: resendEmailFrom,
      html: getVerificationEmailTemplateString(data),
      subject: 'Account Deleted',
      to: email,
    });

    if (error) {
      throw new Error(error.message);
    }
  });
