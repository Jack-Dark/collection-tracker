import { useForm } from '@tanstack/react-form';
import { useEffect } from 'react';

import type { OAuthCompleteMessageEvent } from '#/routes/_unprotected/auth/popup-callback';

import { useInvalidateEverything } from '#/api/react-query-hooks/use-invalidate-everything';
import { useSignInWithEmail } from '#/api/routes/users/sign-in-with-email/sign-in-with-email.react-query';
import { signInWithEmailRequestSchema } from '#/api/routes/users/sign-in-with-email/sign-in-with-email.schema';
import { getUserSession } from '#/auth/user-session/get-user-session';
import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { InputField } from '#/components/Fields/InputField';
import { FormSubmitButton } from '#/components/FormSubmitButton';
import { useValidationFormOptions } from '#/hooks/use-validation-form-options';
import { useAuth } from '#/providers/AuthProvider';
import { oAuthComplete } from '#/routes/_unprotected/auth/popup-callback';

import { LoginWithGoogleButton } from './components/LoginWithGoogleButton';
import { ResetPasswordDialog } from './components/PasswordResetDialog';

export const SignInForm = (props: {
  onSuccess?: () => void | Promise<void>;
}) => {
  const { onSuccess } = props;

  const validationFormOptions = useValidationFormOptions({
    defaultValues: {
      email: '',
      password: '',
    },
    schema: signInWithEmailRequestSchema,
  });

  const { onSignInWithEmail: onSignIn } = useSignInWithEmail();

  const form = useForm({
    ...validationFormOptions,
    formId: 'sign-in',
    onSubmit: async ({ value }) => {
      await onSignIn(value);
    },
  });

  const [showResetPasswordDialog, hideResetPasswordDialog] = useDialog(() => {
    return (
      <form.Field name="email">
        {(field) => {
          return (
            <ResetPasswordDialog
              defaultEmail={field.value}
              hideDialog={hideResetPasswordDialog}
            />
          );
        }}
      </form.Field>
    );
  }, []);

  useEffect(() => {
    const onMessage = async (
      event: MessageEvent<OAuthCompleteMessageEvent>,
    ) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === oAuthComplete) {
        await onSuccess?.();
      }
    };

    window.addEventListener('message', onMessage);

    return () => {
      return window.removeEventListener('message', onMessage);
    };
  }, [onSuccess]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid gap-4 max-w-100">
        <form.Field name="email">
          {(field) => {
            return (
              <InputField
                error={field.errors}
                Label="Email"
                name={field.name}
                onValueChange={(value) => {
                  field.handleChange(value);
                }}
                required
                value={field.value}
              />
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            return (
              <InputField
                error={field.errors}
                Label="Password"
                name={field.name}
                onValueChange={(value) => {
                  field.handleChange(value);
                }}
                required
                type="password"
                value={field.value}
              />
            );
          }}
        </form.Field>

        <div className="grid gap-5 pt-4">
          <div className="flex flex-wrap gap-5 items-center">
            <FormSubmitButton
              className="justify-self-start"
              form={form}
              text="Login"
            />

            <div className="flex flex-wrap items-center gap-1 text-sm">
              <p>Having trouble?</p>
              <Button
                onClick={showResetPasswordDialog}
                size="xs"
                variant="ghost"
              >
                <span className="font-normal">Reset Password</span>
              </Button>
            </div>
          </div>

          <p className="">- or -</p>

          <LoginWithGoogleButton />
        </div>
      </div>
    </form>
  );
};

export const useSignInDialog = () => {
  const [showSignInDialog, hideSignInDialog] = useDialog(() => {
    const invalidateEverything = useInvalidateEverything();

    const { user } = useAuth();

    return (
      <Dialog Header="Sign In" onClose={hideSignInDialog}>
        <SignInForm
          onSuccess={async () => {
            const session = await getUserSession();

            const isSameUser = session && session?.id === user?.id;

            hideSignInDialog();

            if (!isSameUser) {
              await invalidateEverything({ thenNavigateTo: '/collections' });
            }
          }}
        />
      </Dialog>
    );
  }, []);

  return { showSignInDialog };
};
