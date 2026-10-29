import type { RouteComponent } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';

import { useSignUp } from '#/api/routes/users/sign-up/sign-up.react-query';
import { signUpFormSchema } from '#/api/routes/users/sign-up/sign-up.schema';
import { InputField } from '#/components/Fields/InputField';
import { FormSubmitButton } from '#/components/FormSubmitButton';
import { useValidationFormOptions } from '#/hooks/use-validation-form-options';

export const SignUpForm: RouteComponent = () => {
  const navigate = useNavigate();

  const validationFormOptions = useValidationFormOptions({
    defaultValues: {
      confirmPassword: '',
      email: '',
      name: '',
      password: '',
    },
    schema: signUpFormSchema,
  });

  const { onSignUp } = useSignUp({
    onSuccess: () => {
      navigate({
        to: '/collections',
      });
    },
  });

  const form = useForm({
    ...validationFormOptions,
    formId: 'sign-up',
    onSubmit: async ({ value }) => {
      await onSignUp(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid gap-4 max-w-100">
        <form.Subscribe
          selector={(state) => {
            return {
              value: state.values.name,
            };
          }}
        >
          {({ value }) => {
            return (
              <form.Field name="name">
                {(field) => {
                  return (
                    <InputField
                      error={field.errors}
                      Label="Name"
                      name={field.name}
                      onValueChange={(value) => {
                        field.handleChange(value);
                      }}
                      required
                      value={value}
                    />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>

        <form.Subscribe
          selector={(state) => {
            return {
              value: state.values.email,
            };
          }}
        >
          {({ value }) => {
            return (
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
                      value={value}
                    />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>

        <form.Subscribe
          selector={(state) => {
            return {
              value: state.values.password,
            };
          }}
        >
          {({ value }) => {
            return (
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
                      value={value}
                    />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>

        <form.Subscribe
          selector={(state) => {
            return {
              value: state.values.confirmPassword,
            };
          }}
        >
          {({ value }) => {
            return (
              <form.Field name="confirmPassword">
                {(field) => {
                  return (
                    <InputField
                      error={field.errors}
                      Label="Confirm password"
                      name={field.name}
                      onValueChange={(value) => {
                        field.handleChange(value);
                      }}
                      required
                      type="password"
                      value={value}
                    />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>

        <div className="flex">
          <FormSubmitButton form={form} text="Sign Up" />
        </div>

        <div className="grid gap-2 text-theme-t2 text-sm">
          <p>
            Collection Tracker only collects cookies that are strictly required
            for site functionality.
          </p>

          <p>
            We will{' '}
            <strong>
              <em>NEVER</em>
            </strong>{' '}
            share or sell your information.
          </p>
        </div>
      </div>
    </form>
  );
};
