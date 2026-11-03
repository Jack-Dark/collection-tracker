import { Combobox } from '@base-ui/react';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import _ from 'lodash';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type {
  ComboboxFieldPropsDef,
  ComboboxValueDef,
  TValueRecordDef,
} from './ComboboxField.types';

import { FieldWrapper } from '../FieldWrapper';
import { SortableChip } from './components/SortableChip';

export const getNormalizedValue = (
  value: string,
  options?: { caseSensitive?: boolean },
) => {
  const trimmedQuery = value.trim();
  if (options?.caseSensitive) {
    return trimmedQuery;
  } else {
    return trimmedQuery.toLocaleLowerCase();
  }
};

export const ComboboxField = <
  TValue extends TValueRecordDef,
  TMultiple extends boolean | undefined = false,
>(
  props: ComboboxFieldPropsDef<TValue, TMultiple>,
) => {
  const {
    allowCreatable,
    Label,
    ariaLabel = typeof Label === 'string' ? Label : undefined,
    caseSensitiveCreation,
    caseSensitiveFilter,
    className,
    createNewItem,
    description,
    disabled,
    enableChipSort,
    error,
    filter = (item, query) => {
      const normalizedQuery = getNormalizedValue(query, {
        caseSensitive: caseSensitiveFilter,
      });

      if (normalizedQuery) {
        const searchPattern = new RegExp(
          _.escapeRegExp(normalizedQuery),
          caseSensitiveFilter ? undefined : 'i',
        );

        const label = itemToStringLabel(item);

        return searchPattern.test(label);
      }

      return true;
    },
    hideLabel,
    idProperty = 'id',
    inputValue = '',
    invalid,
    isItemEqualToValue = (item, value) => {
      return item[idProperty] === value[idProperty];
    },
    items = [],
    itemsDependencies = [],
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
    labelProperty = 'label',
    multiple,
    name,
    onChipSort,
    onRemoveChip,
    onValueChange,
    placeholder,
    RenderChip = ({ item }) => {
      return <p>{itemToStringLabel(item)}</p>;
    },
    RenderItem = ({ item, multiple, SelectedIndicator }) => {
      return (
        <>
          <p>{itemToStringLabel(item)}</p>

          {multiple && (
            <SelectedIndicator>
              <CheckIcon fontSize="inherit" />
            </SelectedIndicator>
          )}
        </>
      );
    },
    required,
    sortItems = (items) => {
      return _.sortBy(items, (item) => {
        return itemToStringLabel(item);
      });
    },
    validationDebounceTime,
    validationMode,
    value,
    verifyShowNewItem,
  } = props;

  const [displayItems, setDisplayItems] = useState<TValue[]>([]);
  const [query, setQuery] = useState(inputValue);

  const debouncedOnInputValueChanged = useMemo(() => {
    return _.debounce((query: string) => {
      if (allowCreatable) {
        const newDisplayItems = [...displayItems].filter(({ creatable }) => {
          // ? filter out any previously creatable items
          return !creatable;
        });
        const creatableIndex = -1;

        const trimmedQuery = query.trim();
        const normalizedQuery = getNormalizedValue(query);

        if (normalizedQuery) {
          // @ts-expect-error
          const creatableItem: TValue = createNewItem?.(trimmedQuery) || {
            [idProperty]: uuidv4(),
            [labelProperty]: trimmedQuery,
          };

          creatableItem.creatable = true;

          /** Item with label that matches query exactly */
          const exactMatchItem = displayItems.find((item) => {
            const label = itemToStringLabel(item);

            const queryMatchesLabel =
              getNormalizedValue(label, {
                caseSensitive: caseSensitiveCreation,
              }) === normalizedQuery;

            return queryMatchesLabel;
          });

          if (exactMatchItem) {
            if (
              verifyShowNewItem?.({
                itemMatchingQuery: exactMatchItem,
                newItem: creatableItem,
                normalizedQuery,
                query,
              })
            ) {
              newDisplayItems.splice(creatableIndex, 0, creatableItem);
            }
          } else {
            newDisplayItems.splice(creatableIndex, 0, creatableItem);
          }
        }

        setDisplayItems(newDisplayItems);
      }
    }, 300);
  }, [displayItems]);

  useLayoutEffect(() => {
    const getSelectedItemsArray = () => {
      if (Array.isArray(value)) {
        return value;
      } else if (value) {
        return [value];
      } else {
        return [];
      }
    };

    // ? Merge items in list with selected items. This ensures new items are always available even if they don't exist outside of the component yet
    const includedItemsById = new Map<string, true>();
    const uniqueDisplayItems: TValue[] = [
      ...(Array.isArray(items) ? items : items ? [items] : []),
      ...getSelectedItemsArray(),
    ].filter((item) => {
      const idAsString = itemToStringValue(item);
      if (!idAsString || includedItemsById.has(idAsString)) {
        return false;
      } else {
        includedItemsById.set(idAsString, true);

        return true;
      }
    });

    const sortedDisplayItems = sortItems(uniqueDisplayItems);

    setDisplayItems(sortedDisplayItems);
  }, [items, ...itemsDependencies]);

  useLayoutEffect(() => {
    setQuery(inputValue || '');
  }, [inputValue]);

  useEffect(() => {
    return () => {
      debouncedOnInputValueChanged?.cancel();
    };
  }, [debouncedOnInputValueChanged]);

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
      <Combobox.Root
        autoHighlight
        filter={filter}
        inputValue={query}
        isItemEqualToValue={isItemEqualToValue}
        items={displayItems}
        itemToStringLabel={itemToStringLabel}
        itemToStringValue={itemToStringValue}
        multiple={multiple}
        onInputValueChange={(query) => {
          setQuery(query);

          debouncedOnInputValueChanged(query);
        }}
        onValueChange={(
          value:
            | (TMultiple extends true ? never : null)
            | ComboboxValueDef<TValue, TMultiple>,
          eventDetails: Combobox.Root.ChangeEventDetails,
        ) => {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              delete item.creatable;
            });
          } else {
            delete value?.creatable;
          }
          onValueChange?.(value, eventDetails);
        }}
        value={value}
      >
        <div className="max-w-full grid gap-2">
          {Array.isArray(value) && (
            <DragDropProvider
              onDragEnd={(event) => {
                if (event.canceled) return;

                const { source } = event.operation;

                if (isSortable(source)) {
                  const { index, initialIndex } = source;

                  if (initialIndex !== index) {
                    const newItems = [...value];
                    const [removed] = newItems.splice(initialIndex, 1);
                    newItems.splice(index, 0, removed);

                    onChipSort?.(newItems);
                  }
                }
              }}
            >
              <Combobox.Chips
                aria-label={value.length > 0 ? 'Selected labels' : undefined}
                className="flex items-center gap-2 flex-wrap"
              >
                {value.map((item, index) => {
                  const label = itemToStringLabel(item);
                  const id = itemToStringValue(item);

                  return (
                    <SortableChip
                      enableChipSort={enableChipSort}
                      id={id}
                      index={index}
                      item={item}
                      key={id}
                      label={label}
                      onRemoveChip={onRemoveChip}
                      RenderChip={RenderChip}
                    />
                  );
                })}
              </Combobox.Chips>
            </DragDropProvider>
          )}

          <Combobox.Value>
            {() => {
              const classNames =
                'min-w-30 max-w-full p-1.5 border rounded-full border-theme-divider-2 dark:border-theme-divider-3 bg-theme-surface-1 dark:bg-theme-surface-2 dialog:dark:bg-theme-surface-1';

              return multiple ? (
                <Combobox.Input
                  aria-label={ariaLabel}
                  className={classNames}
                  placeholder={placeholder}
                  value={query}
                />
              ) : (
                <Combobox.Input
                  aria-label={ariaLabel}
                  className={classNames}
                  placeholder={placeholder}
                />
              );
            }}
          </Combobox.Value>
        </div>

        <Combobox.Portal>
          <Combobox.Positioner
            align="start"
            className="styles.Positioner"
            sideOffset={4}
          >
            <Combobox.Popup>
              {!allowCreatable && (
                <Combobox.Empty className="bg-theme-surface-1 dark:bg-theme-surface-2 text-theme-t1 border border-theme-divider-2 py-2 rounded-full shadow-lg max-h-100 overflow-auto">
                  <div className="p-2 text-theme-t2">No matches</div>
                </Combobox.Empty>
              )}
              <Combobox.List className="bg-theme-surface-1 dark:bg-theme-surface-2 text-theme-t1 border border-theme-divider-2 dark:border-theme-divider-3 py-2 rounded-sm shadow-lg max-h-100 overflow-auto data-empty:hidden">
                {(listItem: TValue) => {
                  return listItem ? (
                    <Combobox.Item
                      className="flex gap-2 items-center p-2 data-selected:not-data-highlighted:bg-theme-surface-selected data-highlighted:bg-theme-surface-highlighted cursor-pointer"
                      disabled={listItem.disabled}
                      key={itemToStringValue(listItem)}
                      value={listItem}
                    >
                      {listItem.creatable ? (
                        <span className="flex gap-1 items-center">
                          <span>Add "{itemToStringLabel(listItem)}"</span>
                          <AddIcon fontSize="inherit" />
                        </span>
                      ) : (
                        <RenderItem
                          item={listItem}
                          multiple={multiple}
                          SelectedIndicator={Combobox.ItemIndicator}
                        />
                      )}
                    </Combobox.Item>
                  ) : null;
                }}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </FieldWrapper>
  );
};
