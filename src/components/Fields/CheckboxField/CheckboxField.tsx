import { Field } from '@base-ui/react';
import { Checkbox } from '@base-ui/react/checkbox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { useCallback } from 'react';

import type {
  CheckboxBaseIconPropsDef,
  CheckboxBasePropsDef,
  CheckboxFieldProps,
} from './CheckboxField.types';

import { FieldWrapper } from '../FieldWrapper';

export const CheckboxField = (props: CheckboxFieldProps) => {
  const {
    'aria-label': ariaLabel,
    checked,
    disabled,
    indeterminate,
    Label,
    labelPosition = 'right',
    onCheckedChange,
    required,
    value,
    ...fieldWrapperProps
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
      disabled={disabled}
      required={required}
      {...fieldWrapperProps}
    >
      <div
        className={`justify-self-start flex gap-1 items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {labelPosition === 'left' && <LabelComponent />}

        <CheckboxBase
          aria-label={ariaLabel}
          checked={checked}
          disabled={disabled}
          indeterminate={indeterminate}
          onCheckedChange={onCheckedChange}
          value={value}
        />

        {labelPosition === 'right' && <LabelComponent />}
      </div>
    </FieldWrapper>
  );
};

export const CheckboxBase = (props: CheckboxBasePropsDef) => {
  const {
    'aria-label': ariaLabel,
    disabled,
    indeterminate,
    ...rootProps
  } = props;

  return (
    <Checkbox.Root aria-label={ariaLabel} {...rootProps}>
      <Checkbox.Indicator
        keepMounted
        render={(_props, { checked }) => {
          return (
            <>
              {checked ? (
                <CheckBoxIcon
                  className={
                    disabled
                      ? 'text-theme-disabled'
                      : 'text-theme-link hover:text-theme-link-hover'
                  }
                />
              ) : indeterminate ? (
                <IndeterminateCheckBoxIcon
                  className={
                    disabled
                      ? 'text-theme-disabled'
                      : 'text-theme-link/50 hover:text-theme-link-hover'
                  }
                />
              ) : (
                <CheckBoxOutlineBlankIcon
                  className={
                    disabled
                      ? 'text-theme-disabled'
                      : 'text-theme-t1 dark:text-theme-t2 hover:text-theme-link-hover'
                  }
                />
              )}
            </>
          );
        }}
      />
    </Checkbox.Root>
  );
};

export const CheckboxBaseIcon = (props: CheckboxBaseIconPropsDef) => {
  const { 'aria-label': ariaLabel, checked, className, indeterminate } = props;

  return (
    <>
      {checked ? (
        <CheckBoxIcon aria-label={ariaLabel} className={className} />
      ) : indeterminate ? (
        <IndeterminateCheckBoxIcon
          aria-label={ariaLabel}
          className={className}
        />
      ) : (
        <CheckBoxOutlineBlankIcon
          aria-label={ariaLabel}
          className={className}
        />
      )}
    </>
  );
};
