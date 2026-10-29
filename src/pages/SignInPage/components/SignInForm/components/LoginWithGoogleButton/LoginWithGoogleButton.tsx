import GoogleIcon from '@mui/icons-material/Google';

import { useSignInWithProvider } from '#/api/routes/users/sign-in-with-provider/sign-in-with-provider.react-query';
import { Button } from '#/components/Button';

export const LoginWithGoogleButton = (props: { text?: string }) => {
  const { text = 'Login with Google' } = props;

  const { onSignInWithProvider } = useSignInWithProvider();

  return (
    <Button
      className="justify-self-start"
      Icon={GoogleIcon}
      onClick={async () => {
        await onSignInWithProvider({
          provider: 'google',
        });
      }}
      text={text}
      variant="mono"
    />
  );
};
