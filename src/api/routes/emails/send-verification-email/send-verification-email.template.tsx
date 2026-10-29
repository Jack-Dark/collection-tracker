import { renderToString } from 'react-dom/server';

import type { SendVerificationEmailTemplateArgs } from './send-verification-email.types';

import { EmailSignature } from '../components/EmailSignature';

const ResetPasswordEmailTemplate = ({
  url,
  name,
}: SendVerificationEmailTemplateArgs) => {
  return (
    <div>
      <p>Hi {name || 'there'}!</p>
      <p>
        Click{' '}
        <a href={url} target="_blank">
          here
        </a>{' '}
        to verify your email address.
      </p>
      <EmailSignature />
    </div>
  );
};

export const getVerificationEmailTemplateString = (
  props: SendVerificationEmailTemplateArgs,
) => {
  return renderToString(<ResetPasswordEmailTemplate {...props} />);
};
