import { renderToString } from 'react-dom/server';

import type { SendAccountDeletedEmailRequestArgs } from './send-account-deleted-email.types';

import { EmailSignature } from '../components/EmailSignature';

const ResetPasswordEmailTemplate = ({
  email,
  name,
}: SendAccountDeletedEmailRequestArgs) => {
  return (
    <div>
      <p>Hi {name || 'there'}!</p>
      <p>
        The Collection Tracker account associated with {email} has been deleted.
      </p>
      <EmailSignature />
    </div>
  );
};

export const getVerificationEmailTemplateString = (
  props: SendAccountDeletedEmailRequestArgs,
) => {
  return renderToString(<ResetPasswordEmailTemplate {...props} />);
};
