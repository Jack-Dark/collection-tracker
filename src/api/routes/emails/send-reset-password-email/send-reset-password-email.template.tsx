import { renderToString } from 'react-dom/server';

import { resetPasswordTokenExpiresInMinutes } from '#/auth/auth';

import type { ResetPasswordEmailTemplatePropsDef } from './send-reset-password-email.types';

import { EmailSignature } from '../components/EmailSignature';

const ResetPasswordEmailTemplate = ({
  url,
  name,
}: ResetPasswordEmailTemplatePropsDef) => {
  return (
    <div>
      <p>Hi {name || 'there'},</p>
      <p>
        We received a request to reset the password for your Collection Tracker
        account.
      </p>
      <p>
        Click{' '}
        <a href={url} target="_blank">
          here
        </a>{' '}
        to choose a new password.
      </p>
      <p>
        This link will expire in {resetPasswordTokenExpiresInMinutes} minutes
        for your security.
      </p>
      <p>
        If you didn't request a password reset, you can safely ignore this
        email. Your password will remain unchanged.
      </p>
      <EmailSignature />
    </div>
  );
};

export const getSendPasswordEmailTemplateString = (
  props: ResetPasswordEmailTemplatePropsDef,
) => {
  return renderToString(<ResetPasswordEmailTemplate {...props} />);
};
