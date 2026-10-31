import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/auth/auth-middleware';

import { resend, resendEmailFrom } from '../resend.configs';
import { sendDeleteAccountVerificationEmailSchema } from './send-delete-account-verification-email.schema';
import { getVerificationEmailTemplateString } from './send-delete-account-verification-email.template';

export const sendDeleteAccountVerificationEmailServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(sendDeleteAccountVerificationEmailSchema)
  .handler(async ({ data }) => {
    const { email } = data;

    const { error } = await resend.emails.send({
      from: resendEmailFrom,
      html: getVerificationEmailTemplateString(data),
      subject: 'Confirm account deletion request',
      to: email,
    });

    if (error) {
      throw new Error(error.message);
    }
  });
