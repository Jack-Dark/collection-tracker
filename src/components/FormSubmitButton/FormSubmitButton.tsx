import type { AnyReactFormApi } from '@tanstack/react-form';

import type { ButtonPropsDef } from '../Button/Button.types';

import { Button } from '../Button';

export const FormSubmitButton = <TForm extends AnyReactFormApi>(
  props: { form: TForm } & ButtonPropsDef,
) => {
  const { disabled, form, ...buttonProps } = props;

  return (
    <form.Subscribe
      selector={(state) => {
        return {
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        };
      }}
    >
      {(state) => {
        const { canSubmit, isSubmitting } = state;

        return (
          <Button
            {...buttonProps}
            disabled={!canSubmit || disabled}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              await form.handleSubmit();
            }}
            processing={isSubmitting}
            type="submit"
          />
        );
      }}
    </form.Subscribe>
  );
};
