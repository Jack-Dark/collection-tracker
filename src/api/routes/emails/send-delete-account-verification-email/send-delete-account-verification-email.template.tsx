import { renderToString } from 'react-dom/server';

import { configs } from '#/configs';

import type { SendDeleteAccountVerificationEmailRequestArgs } from './send-delete-account-verification-email.types';

const ResetPasswordEmailTemplate = ({
  url,
  email,
  name,
}: SendDeleteAccountVerificationEmailRequestArgs) => {
  return (
    <div>
      <p>Hi {name || 'there'}!</p>
      <p>
        We received a request to delete the Collection Tracker account
        associated with {email}. Should you proceed, be aware that this is
        permanent and cannot be undone.{' '}
        <a href={url} target="_blank">
          Click here to permanently delete your account.
        </a>
      </p>
      <p>
        If you did not request account deletion, please{' '}
        <a
          href={`${configs.siteUrl}/sign-in?resetPassword=true`}
          target="_blank"
        >
          click here to reset your password immediately!
        </a>
      </p>
      <br />
      <p>Best regards,</p>
      <p>The Collection Tracker Team</p>
    </div>
  );
};

export const getVerificationEmailTemplateString = (
  props: SendDeleteAccountVerificationEmailRequestArgs,
) => {
  return renderToString(<ResetPasswordEmailTemplate {...props} />);
};
