import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';

import { resend, resendEmailFrom } from '../resend.configs';
import { sendResetPasswordEmailSchema } from './send-reset-password-email.schema';
import { getSendPasswordEmailTemplateString } from './send-reset-password-email.template';

export const sendResetPasswordEmailServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(sendResetPasswordEmailSchema)
  .handler(async ({ data }) => {
    const { email, ...emailProps } = data;

    const { error } = await resend.emails.send({
      from: resendEmailFrom,
      html: getSendPasswordEmailTemplateString(emailProps),
      subject: 'Reset your password',
      to: email,
    });

    if (error) {
      throw new Error(error.message);
    }
  });
