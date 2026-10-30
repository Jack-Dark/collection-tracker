import { Select } from '@base-ui/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fragment } from 'react/jsx-runtime';
import { twJoin, twMerge } from 'tailwind-merge';

import type {
  DefaultSelectItemDef,
  SelectFieldPropsDef,
} from './SelectField.types';

import { FieldWrapper } from '../FieldWrapper';

export const SelectField = <TItem extends DefaultSelectItemDef>(
  props: SelectFieldPropsDef<TItem>,
) => {
  const {
    'aria-label': ariaLabel,
    className,
    description,
    disabled,
    error,
    hideLabel,
    idProperty = 'id',
    invalid,
    isItemEqualToValue = (item, value) => {
      return item[idProperty] === value[idProperty];
    },
    items,
    itemToStringLabel = (item) => {
      if (item) {
        const label = item[labelProperty];

        const stringLabel = String(label);
        if (label == stringLabel) {
          return stringLabel;
        }
      }

      return '';
    },
    itemToStringValue = (item) => {
      if (item) {
        const value = item[idProperty];
        const stringValue = String(value);
        if (value == stringValue) {
          return stringValue;
        }
      }

      return '';
    },
    keyPrefix = 'key',
    Label,
    labelProperty = 'label',
    name,
    onValueChange,
    placeholder,
    RenderItem = ({ item, ...rest }) => {
      return <span {...rest}>{itemToStringLabel(item)}</span>;
    },
    RenderValue = ({ item, ...rest }) => {
      return <span {...rest}>{itemToStringLabel(item)}</span>;
    },
    required,
    validationDebounceTime,
    validationMode,
    value,
    ...rootProps
  } = props;

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
      <Select.Root
        {...rootProps}
        isItemEqualToValue={isItemEqualToValue}
        itemToStringLabel={itemToStringLabel}
        itemToStringValue={itemToStringValue}
        onValueChange={(item) => {
          onValueChange(item);
        }}
        value={value}
      >
        <Select.Trigger
          aria-label={ariaLabel}
          className="grid grid-cols-[1fr_auto] gap-1 md:gap-2 p-1.5 bg-theme-surface-1 dark:bg-theme-surface-2 dialog:bg-theme-surface-1 border rounded-full border-theme-divider-1 dark:border-theme-divider-3 cursor-pointer text-left"
        >
          <Select.Value
            className="grid justify-start"
            placeholder={placeholder}
          >
            {(item: TItem | undefined) => {
              return item ? (
                <RenderValue
                  className={`min-w-30 ${
                    item?.disabled || item?.placeholder
                      ? 'text-theme-disabled '
                      : ''
                  } ${item?.disabled ? 'cursor-not-allowed' : ''}`}
                  item={item}
                />
              ) : (
                <span className="text-theme-t2">{placeholder}</span>
              );
            }}
          </Select.Value>
          <Select.Icon>
            <ExpandMoreIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            align="start"
            alignItemWithTrigger={false}
            className="p-2"
          >
            <Select.Popup>
              <Select.List className="min-w-30 bg-theme-surface-1 dark:bg-theme-surface-2 text-theme-t1 border border-theme-divider-1 dark:border-theme-divider-3 py-2 rounded-sm shadow-lg max-h-100 overflow-auto data-empty:hidden">
                {items.map((item, index) => {
                  return (
                    <Fragment
                      key={`${keyPrefix}-${itemToStringValue(item) || index}`}
                    >
                      {item?.separator ? (
                        <Select.Separator className="mx-2 my-0.5 h-px bg-theme-surface-3" />
                      ) : (
                        <Select.Item
                          className={twMerge(
                            'p-2 flex align-items-center',
                            item?.placeholder && 'text-theme-t2',
                            item?.disabled
                              ? 'text-theme-disabled cursor-not-allowed'
                              : twJoin(
                                  'cursor-pointer',
                                  // ? selected status styles
                                  'data-selected:not-data-highlighted:bg-theme-surface-selected',
                                  // ? highlighted status styles
                                  'data-highlighted:bg-theme-surface-highlighted',
                                ),
                          )}
                          disabled={item?.disabled}
                          key={itemToStringValue(item)}
                          value={item}
                        >
                          <Select.ItemText>
                            <RenderItem item={item} />
                          </Select.ItemText>
                        </Select.Item>
                      )}
                    </Fragment>
                  );
                })}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </FieldWrapper>
  );
};
