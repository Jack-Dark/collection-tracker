import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

import type { RouterPath } from '#/types';

import { useInvalidateGetNavMenuCollections } from '#/api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { useSignInWithEmail } from '#/api/routes/users/sign-in-with-email/sign-in-with-email.react-query';
import { signInWithEmailRequestSchema } from '#/api/routes/users/sign-in-with-email/sign-in-with-email.schema';
import { Button } from '#/components/Button';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { InputField } from '#/components/Fields/InputField';
import { FormSubmitButton } from '#/components/FormSubmitButton';
import { useValidationFormOptions } from '#/hooks/use-validation-form-options';
import { Route as SignInRoute } from '#/routes/_unprotected/sign-in';

import { LoginWithGoogleButton } from './components/LoginWithGoogleButton';
import { ResetPasswordDialog } from './components/PasswordResetDialog';

export const SignInForm = () => {
  const navigate = useNavigate();
  const searchQueries = SignInRoute.useSearch();

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const validationFormOptions = useValidationFormOptions({
    defaultValues: {
      email: '',
      password: '',
    },
    schema: signInWithEmailRequestSchema,
  });

  const { onSignInWithEmail: onSignIn } = useSignInWithEmail({
    onSuccess: () => {
      invalidateGetNavMenuCollections();

      navigate({
        to: searchQueries.redirect || ('/collections' satisfies RouterPath),
      });
    },
  });

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

  useLayoutEffect(() => {
    if (searchQueries.resetPassword) {
      showResetPasswordDialog();
    }
  }, [searchQueries.resetPassword]);

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
