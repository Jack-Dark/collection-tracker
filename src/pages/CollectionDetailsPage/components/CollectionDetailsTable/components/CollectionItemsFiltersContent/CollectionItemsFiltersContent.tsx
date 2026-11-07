import type { PropsWithChildren } from 'react';

import { Slider } from '@base-ui/react';
import InfoIcon from '@mui/icons-material/Info';
import { createStore } from '@tanstack/react-store';
import { useLayoutEffect, useMemo } from 'react';

import type { GetFiltersForCollectionResponseDef } from '#/api/routes/collection-items/get-filters-for-collection/get-filters-for-collection.types';
import type { DefaultSelectItemDef } from '#/components/Fields/SelectField/SelectField.types';

import { useGetFiltersForCollection } from '#/api/routes/collection-items/get-filters-for-collection/get-filters-for-collection.react-query';
import { Button } from '#/components/Button';
import { ComboboxField } from '#/components/Fields/ComboboxField';
import { FieldWrapper } from '#/components/Fields/FieldWrapper';
import { SelectField } from '#/components/Fields/SelectField';
import { LoadingSpinner } from '#/components/FullPageLoadingSpinner/components/LoadingSpinner';
import { Popover } from '#/components/Popover';
import { Route as CollectionDetailsRoute } from '#/routes/_protected/collections/$id';

import type {
  CollectionItemsFiltersFormDef,
  CollectionItemsFiltersFormSchemaDef,
} from '../../hooks/use-collection-details-filters-props';

type FiltersBlockPropsDef = PropsWithChildren<{
  label: string | null;
  onReset: () => void;
  popoverMsg?: string;
}>;

const FiltersBlock = (props: FiltersBlockPropsDef) => {
  const { children, label, onReset, popoverMsg } = props;

  return (
    <div className="grid gap-1">
      <div className="flex items-baseline gap-1">
        <h5 className="grid grid-cols-[auto_1fr] gap-1">
          {label}
          {popoverMsg && (
            <Popover
              Description={popoverMsg}
              Trigger={() => {
                return (
                  <InfoIcon
                    className="text-theme-t3 dark:text-theme-t2"
                    fontSize="inherit"
                  />
                );
              }}
            />
          )}
        </h5>

        <Button
          className="font-normal"
          onClick={onReset}
          size="xs"
          text="Reset"
          variant="ghost"
        />
      </div>

      {children}
    </div>
  );
};

type CollectionDetailsFiltersContentPropsDef = {
  collectionId: number;
  form: CollectionItemsFiltersFormDef;
};

const getAdjustedRange = (range: {
  max: number | undefined;
  min: number | undefined;
}) => {
  const minValue = Math.min(0, range.min ?? 0);
  const maxValue = Math.max(10, range.max ?? 10);

  return { max: maxValue, min: minValue };
};

export const collectionItemsFiltersDefaultValuesStore =
  createStore<CollectionItemsFiltersFormSchemaDef>({ filters: {} });

export const CollectionDetailsFiltersContent = (
  props: CollectionDetailsFiltersContentPropsDef,
) => {
  const { collectionId, form } = props;

  const { filters: searchQueryFilters } = CollectionDetailsRoute.useSearch();

  const {
    data: filterOptions,
    isFetching,
    isSuccess,
  } = useGetFiltersForCollection({
    placeholderData: [],
    requestArgs: { id: collectionId },
  });

  useLayoutEffect(() => {
    if (isSuccess) {
      const filtersFormDefaultValues: CollectionItemsFiltersFormSchemaDef['filters'] =
        filterOptions.reduce<
          Record<number, CollectionItemsFiltersFormSchemaDef['filters'][number]>
        >((acc, { id, rangeMax, rangeMin, type }) => {
          if (acc[id]) {
            return acc;
          } else {
            if (type === 'string') {
              const emptyItems: string[] = [];

              return {
                ...acc,
                [id]: {
                  items: emptyItems,
                  rangeMax: undefined,
                  rangeMin: undefined,
                  type,
                  value: undefined,
                } satisfies CollectionItemsFiltersFormSchemaDef['filters'][number],
              };
            }
            if (type === 'number') {
              const range = getAdjustedRange({ max: rangeMax, min: rangeMin });

              return {
                ...acc,
                [id]: {
                  items: undefined,
                  rangeMax: range.max,
                  rangeMin: range.min,
                  type,
                  value: undefined,
                } satisfies CollectionItemsFiltersFormSchemaDef['filters'][number],
              };
            }
            if (type === 'boolean') {
              return {
                ...acc,
                [id]: {
                  items: undefined,
                  rangeMax: undefined,
                  rangeMin: undefined,
                  type,
                  value: null,
                } satisfies CollectionItemsFiltersFormSchemaDef['filters'][number],
              };
            }
          }

          return acc;
        }, searchQueryFilters);

      collectionItemsFiltersDefaultValuesStore.setState(() => {
        return {
          filters: filtersFormDefaultValues,
        };
      });

      form.setFieldValue('filters', filtersFormDefaultValues);
    }
  }, [isSuccess, filterOptions]);

  return (
    <div className="grid gap-5">
      {isFetching ? (
        <LoadingSpinner />
      ) : (
        <>
          {filterOptions?.map((customField) => {
            return (
              <CustomFieldTypeFilter
                customField={customField}
                form={form}
                key={customField.id}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

const CustomFieldTypeFilter = (props: {
  customField: GetFiltersForCollectionResponseDef[number];
  form: CollectionItemsFiltersFormDef;
}) => {
  const { customField, form } = props;

  return (
    <form.Field key={customField.id} name={`filters.${customField.id}`}>
      {(field) => {
        if (customField.type === 'string' && field.value?.type === 'string') {
          return (
            <CustomFieldStringFilter customField={customField} form={form} />
          );
        }

        if (customField.type === 'number' && field.value?.type === 'number') {
          return (
            <CustomFieldNumberFilter customField={customField} form={form} />
          );
        }

        if (customField.type === 'boolean' && field.value?.type === 'boolean') {
          return (
            <CustomFieldBooleanFilter customField={customField} form={form} />
          );
        }
      }}
    </form.Field>
  );
};

const CustomFieldBooleanFilter = (props: {
  customField: GetFiltersForCollectionResponseDef[number];
  form: CollectionItemsFiltersFormDef;
}) => {
  const { customField, form } = props;

  const booleanSelectItems = useMemo(() => {
    return [
      {
        label: `Select...`,
        placeholder: true,
        value: null,
      },
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ] satisfies DefaultSelectItemDef[];
  }, []);

  return (
    <form.Field key={customField.id} name={`filters.${customField.id}`}>
      {(field) => {
        // ? Comparison is really just for type safety
        if (customField.type === 'boolean' && field.value?.type === 'boolean') {
          const { value } = field;

          const selectedItem = booleanSelectItems.find((item) => {
            return item.value === value.value;
          });

          return (
            <FiltersBlock
              key={customField.id}
              label={customField.name}
              onReset={() => {
                field.handleChange({
                  ...value,
                  value: null,
                });
              }}
            >
              <SelectField
                idProperty="value"
                items={booleanSelectItems}
                labelProperty="label"
                name={field.name}
                onValueChange={(item) => {
                  if (item) {
                    field.handleChange({
                      ...value,
                      value: item.value,
                    });
                  }
                }}
                value={selectedItem}
              />
            </FiltersBlock>
          );
        }
      }}
    </form.Field>
  );
};

const CustomFieldNumberFilter = (props: {
  customField: GetFiltersForCollectionResponseDef[number];
  form: CollectionItemsFiltersFormDef;
}) => {
  const { customField, form } = props;

  return (
    <form.Field key={customField.id} name={`filters.${customField.id}`}>
      {(field) => {
        // ? Comparison is really just for type safety
        if (customField.type === 'number' && field.value?.type === 'number') {
          // ? deconstructed to solve type errors
          const { value } = field;

          const range = getAdjustedRange({
            max: value.rangeMax,
            min: value.rangeMin,
          });

          const isMinEqualToMax = customField.rangeMin === customField.rangeMax;

          return isMinEqualToMax ? null : (
            <FiltersBlock
              key={customField.id}
              label={customField.name}
              onReset={() => {
                field.handleChange({
                  items: undefined,
                  rangeMax: undefined,
                  rangeMin: undefined,
                  type: customField.type,
                  value: undefined,
                });
              }}
              popoverMsg={`If at the maximum range, items with undefined ${customField.name} will be returned.`}
            >
              <FieldWrapper
                error={field.errors}
                hideLabel
                Label={customField.name}
                name={field.name}
              >
                <span className="text-sm">
                  {(value.rangeMin ?? range.min) ===
                  (value.rangeMax ?? range.max)
                    ? value.rangeMin
                    : `${value.rangeMin ?? range.min} - ${value.rangeMax ?? range.max}`}
                </span>
                <Slider.Root
                  max={range?.max}
                  min={range?.min}
                  onValueChange={([min, max]) => {
                    field.handleChange({
                      ...value,
                      items: undefined,
                      rangeMax: max,
                      rangeMin: min,
                      value: undefined,
                    });
                  }}
                  value={[
                    value.rangeMin ?? range.min,
                    value.rangeMax ?? range.max,
                  ]}
                >
                  <Slider.Control className="py-2 cursor-pointer data-dragging:cursor-grabbing">
                    <Slider.Track className="bg-gray-500 h-1 w-full">
                      <Slider.Indicator className="bg-primary-700" />
                      <Slider.Thumb
                        aria-label="Minimum value"
                        className="size-3 bg-primary-700 rounded-full cursor-grab"
                        index={0}
                      />
                      <Slider.Thumb
                        aria-label="Maximum value"
                        className="size-3 bg-primary-700 rounded-full cursor-grab"
                        index={1}
                      />
                    </Slider.Track>
                  </Slider.Control>
                </Slider.Root>
                <div className="flex justify-between text-theme-t2">
                  <span className="text-sm">{range?.min}</span>
                  <span className="text-sm">{range?.max}</span>
                </div>
              </FieldWrapper>
            </FiltersBlock>
          );
        }
      }}
    </form.Field>
  );
};

const CustomFieldStringFilter = (props: {
  customField: GetFiltersForCollectionResponseDef[number];
  form: CollectionItemsFiltersFormDef;
}) => {
  const { customField, form } = props;

  return (
    <form.Field key={customField.id} name={`filters.${customField.id}`}>
      {(field) => {
        // ? if statement is really just for type inference
        if (customField.type === 'string' && field.value?.type === 'string') {
          return (
            <form.ArrayField name={`filters.${customField.id}.items`}>
              {(field) => {
                // ? if statement is really just for type inference
                if (Array.isArray(field.value)) {
                  return (
                    <FiltersBlock
                      key={customField.id}
                      label={customField.name}
                      onReset={() => {
                        field.clearValues();
                      }}
                    >
                      <ComboboxField
                        idProperty="value"
                        items={customField.items}
                        labelProperty="label"
                        multiple
                        name={field.name}
                        onValueChange={(selectedItems) => {
                          const formattedValues = selectedItems.map(
                            ({ value }) => {
                              return value;
                            },
                          );
                          field.handleChange(formattedValues);
                        }}
                        placeholder="Select..."
                        value={field.value.map((value) => {
                          return { label: value, value };
                        })}
                      />
                    </FiltersBlock>
                  );
                }
              }}
            </form.ArrayField>
          );
        }
      }}
    </form.Field>
  );
};
