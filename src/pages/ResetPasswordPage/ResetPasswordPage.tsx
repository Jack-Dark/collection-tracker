import type { RouteComponent } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

import { useInvalidateGetNavMenuCollections } from '#/api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { useResetPassword } from '#/api/routes/users/reset-password/reset-password.react-query';
import { resetPasswordFormSchema } from '#/api/routes/users/reset-password/reset-password.schema';
import { useSignInWithEmail } from '#/api/routes/users/sign-in-with-email/sign-in-with-email.react-query';
import { InputField } from '#/components/Fields/InputField';
import { FormSubmitButton } from '#/components/FormSubmitButton';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { PageWrapper } from '#/components/PageWrapper';
import { useValidationFormOptions } from '#/hooks/use-validation-form-options';
import { Route as ResetPasswordRoute } from '#/routes/_unprotected/reset-password';

export const ResetPasswordPage: RouteComponent = () => {
  const navigate = useNavigate();
  const { email, error, token } = ResetPasswordRoute.useSearch();

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const validationFormOptions = useValidationFormOptions({
    defaultValues: {
      confirmNewPassword: '',
      newPassword: '',
      token: token || '',
    },
    schema: resetPasswordFormSchema,
  });

  const { onSignInWithEmail } = useSignInWithEmail();
  const { onResetPassword } = useResetPassword();

  const form = useForm({
    ...validationFormOptions,
    formId: 'reset-password',
    onSubmit: async ({ value }) => {
      await onResetPassword(value);

      await invalidateGetNavMenuCollections();

      if (email) {
        await onSignInWithEmail({
          email,
          password: value.newPassword,
        });

        navigate({
          to: '/collections',
        });
      }
    },
  });

  const { notifyError } = useNotifications();

  useLayoutEffect(() => {
    if (error) {
      navigate({
        search: { resetPassword: true },
        to: '/sign-in',
      });
      notifyError(
        'There was a problem with your password reset token. Please try again.',
      );
    }
  }, [error]);

  return (
    <PageWrapper>
      <div className="grid gap-10">
        <h1>Reset Password</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 max-w-100">
            <form.Field name="newPassword">
              {(field) => {
                return (
                  <InputField
                    autoFocus
                    error={field.errors}
                    Label="New Password"
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

            <form.Field name="confirmNewPassword">
              {(field) => {
                return (
                  <InputField
                    error={field.errors}
                    Label="Confirm Password"
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

            <div className="flex gap-10 justify-between items-center pt-4">
              <FormSubmitButton form={form} text="Submit" />
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};
