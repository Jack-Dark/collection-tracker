import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';

import { resend, resendEmailFrom } from '../resend.configs';
import { sendVerificationEmailSchema } from './send-verification-email.schema';
import { getVerificationEmailTemplateString } from './send-verification-email.template';

export const sendVerificationEmailServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(sendVerificationEmailSchema)
  .handler(async ({ data }) => {
    const { email, ...emailProps } = data;

    const { error } = await resend.emails.send({
      from: resendEmailFrom,
      html: getVerificationEmailTemplateString(emailProps),
      subject: 'Verify your email address',
      to: email,
    });

    if (error) {
      throw new Error(error.message);
    }
  });
