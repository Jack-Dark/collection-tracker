import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import { PageWrapper } from '#/components/PageWrapper';

export const oAuthComplete = 'OAUTH_COMPLETE' as const;

export type OAuthCompleteMessageEvent = { type: typeof oAuthComplete };

const PopupCallbackPage = () => {
  useEffect(() => {
    if (window && window.opener) {
      window.opener.postMessage(
        { type: oAuthComplete },
        window.location.origin,
      );
      window.close();
    }
  }, []);

  return (
    <PageWrapper hideHeader>
      <div className="size-full flex items-center justify-center">
        <p>Completing sign-in...</p>
      </div>
    </PageWrapper>
  );
};

export const Route = createFileRoute('/_unprotected/auth/popup-callback')({
  component: PopupCallbackPage,
});
