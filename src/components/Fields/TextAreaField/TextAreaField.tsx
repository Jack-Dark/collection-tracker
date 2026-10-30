import { Field } from '@base-ui/react';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import type { TextAreaFieldPropsDef } from './TextAreaField.types';

import { FieldWrapper } from '../FieldWrapper';

export const TextAreaField = (props: TextAreaFieldPropsDef) => {
  const {
    autoFocus,
    className,
    description,
    disabled,
    error,
    invalid,
    Label,
    name,
    onValueChange,
    onValueChangeDebounceMs = 300,
    placeholder,
    ref,
    required,
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

  return (
    <FieldWrapper
      className={className}
      description={description}
      disabled={disabled}
      error={error}
      invalid={invalid}
      Label={Label}
      name={name}
      required={required}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}
    >
      <Field.Control
        autoFocus={autoFocus}
        className="min-w-30 p-1.5 border rounded-2xl border-theme-divider-2 dark:border-theme-divider-3 bg-theme-surface-1 dark:bg-theme-surface-2"
        onValueChange={(value) => {
          setInputValue(value);
          debouncedOnValueChange?.(value);
        }}
        placeholder={placeholder}
        ref={ref}
        render={(props) => {
          return <textarea {...props} />;
        }}
        required={required}
        value={inputValue}
      />
    </FieldWrapper>
  );
};
