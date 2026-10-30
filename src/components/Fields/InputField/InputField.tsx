import { Input } from '@base-ui/react';
import _ from 'lodash';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import type { InputFieldProps } from './InputField.types';

import { FieldWrapper } from '../FieldWrapper';

export const InputField = (props: InputFieldProps) => {
  const {
    autoComplete = 'on',
    autoFocus,
    className,
    defaultValue,
    description,
    disabled,
    error,
    hideLabel,
    inputClassName,
    invalid,
    Label,
    name,
    onBlur,
    onChange,
    onValueChange,
    onValueChangeDebounceMs = 300,
    placeholder,
    ref,
    required,
    type,
    validationDebounceTime,
    validationMode,
    value,
  } = props;

  const [inputValue, setInputValue] = useState<string>(String(value));

  const debouncedOnValueChange = useMemo(() => {
    return onValueChange
      ? _.debounce(onValueChange, onValueChangeDebounceMs)
      : undefined;
  }, []);

  useEffect(() => {
    return () => {
      debouncedOnValueChange?.cancel();
    };
  }, [debouncedOnValueChange]);

  useLayoutEffect(() => {
    setInputValue(String(value));
  }, [value]);

  return (
    <FieldWrapper
      className={className}
      description={description}
      disabled={disabled}
      error={error}
      hideLabel={hideLabel}
      invalid={invalid}
      Label={Label}
      name={name}
      required={required}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <Input
        autoComplete={type === 'password' ? 'off' : autoComplete}
        autoFocus={autoFocus}
        className={twMerge(
          'min-w-30 max-w-full p-1.5 border rounded-full border-theme-divider-2 dark:border-theme-divider-3 bg-theme-surface-1 dark:bg-theme-surface-2 dialog:dark:bg-theme-surface-1',
          inputClassName,
        )}
        data-input=""
        defaultValue={defaultValue}
        onBlur={onBlur}
        onChange={onChange}
        onValueChange={(value) => {
          setInputValue(value);
          debouncedOnValueChange?.(value);
        }}
        placeholder={placeholder}
        ref={ref}
        required={required}
        type={type}
        value={inputValue}
      />
    </FieldWrapper>
  );
};
