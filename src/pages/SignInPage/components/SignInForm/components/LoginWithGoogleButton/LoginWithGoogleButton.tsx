import GoogleIcon from '@mui/icons-material/Google';

import type { RouterPath } from '#/types';

import { useSignInWithProvider } from '#/api/routes/users/sign-in-with-provider/sign-in-with-provider.react-query';
import { Button } from '#/components/Button';

export const LoginWithGoogleButton = (props: { text?: string }) => {
  const { text = 'Login with Google' } = props;

  const { onSignInWithProvider } = useSignInWithProvider();

  const handleGoogleSignIn = async () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      '',
      'google-oauth',
      `popup=yes,width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) return;

    try {
      await onSignInWithProvider(
        {
          callbackURL: '/auth/popup-callback' satisfies RouterPath,
          disableRedirect: true,
          provider: 'google',
        },
        {
          onError: () => {
            popup.close();
          },
          onSuccess: ({ url }) => {
            if (url) {
              popup.location.href = url;
            } else {
              popup.close();
            }
          },
        },
      );
    } catch {
      popup.close();
    }
  };

  return (
    <Button
      className="justify-self-start"
      icon={<GoogleIcon />}
      onClick={handleGoogleSignIn}
      text={text}
      variant="mono"
    />
  );
};
