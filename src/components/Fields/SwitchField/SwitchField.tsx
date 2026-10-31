import { Field, Switch as SwitchMui } from '@base-ui/react';
import { useCallback } from 'react';
import { twJoin } from 'tailwind-merge';

import type { SwitchFieldPropsDef } from './SwitchField.types';

import { FieldWrapper } from '../FieldWrapper';

export const SwitchField = (props: SwitchFieldPropsDef) => {
  const {
    checked,
    className,
    description,
    disabled,
    error,
    invalid,
    Label,
    labelPosition = 'right',
    name,
    onCheckedChange,
    required,
    validationDebounceTime,
    validationMode,
  } = props;

  const LabelComponent = useCallback(() => {
    return Label ? (
      <Field.Label className="cursor-pointer">
        {typeof Label === 'string' ? Label : <Label />}
        {required ? <span className="text-theme-t-alert">*</span> : undefined}
      </Field.Label>
    ) : null;
  }, [Label, required]);

  return (
    <FieldWrapper
      className={className}
      description={description}
      disabled={disabled}
      error={error}
      invalid={invalid}
      name={name}
      required={required}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <div className="flex gap-2 items-center">
        {labelPosition === 'left' && <LabelComponent />}

        <SwitchMui.Root
          checked={checked}
          className={twJoin(
            `flex h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors duration-150 ease-[ease] border data-checked:bg-theme-link data-checked:border-theme-link`,
            disabled
              ? 'cursor-not-allowed border-gray-300 bg-gray-300'
              : 'cursor-pointer border-gray-500 bg-gray-500',
          )}
          onCheckedChange={onCheckedChange}
        >
          <SwitchMui.Thumb className="size-3.5 rounded-full bg-white transition-[translate,background-color] duration-150 ease-[ease] data-checked:translate-x-4" />
        </SwitchMui.Root>

        {labelPosition === 'right' && <LabelComponent />}
      </div>
    </FieldWrapper>
  );
};
