import type { PropsWithChildren } from 'react';

import { Slider } from '@base-ui/react';
import InfoIcon from '@mui/icons-material/Info';
import { useMemo } from 'react';

import type { GetFiltersForCollectionResponseDef } from '#/api/routes/collection-items/get-filters-for-collection/get-filters-for-collection.types';
import type { DefaultSelectItemDef } from '#/components/Fields/SelectField/SelectField.types';

import { useGetFiltersForCollection } from '#/api/routes/collection-items/get-filters-for-collection/get-filters-for-collection.react-query';
import { Button } from '#/components/Button';
import { CheckboxGroupField } from '#/components/Fields/CheckboxGroup';
import { FieldWrapper } from '#/components/Fields/FieldWrapper';
import { SelectField } from '#/components/Fields/SelectField';
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

export const CollectionDetailsFiltersContent = (
  props: CollectionDetailsFiltersContentPropsDef,
) => {
  const { collectionId, form } = props;

  const { filters: searchQueryFilters } = CollectionDetailsRoute.useSearch();

  // TODO - IMPROVEMENT: WRAP IN SUSPENSE SO REQUEST IS MADE ON DEMAND
  const { data: filterOptions } = useGetFiltersForCollection({
    onSuccess: (filterOptions) => {
      const filtersFormDefaultValues: CollectionItemsFiltersFormSchemaDef['filters'] =
        filterOptions.reduce<
          Record<number, CollectionItemsFiltersFormSchemaDef['filters'][number]>
        >((acc, { id, range, type }) => {
          if (acc[id]) {
            return acc;
          } else {
            if (type === 'string') {
              const emptyItems: string[] = [];

              return {
                ...acc,
                [id]: {
                  items: emptyItems,
                  range: undefined,
                  type,
                  value: undefined,
                } satisfies CollectionItemsFiltersFormSchemaDef['filters'][number],
              };
            }
            if (type === 'number') {
              return {
                ...acc,
                [id]: {
                  items: undefined,
                  range,
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
                  range: undefined,
                  type,
                  value: null,
                } satisfies CollectionItemsFiltersFormSchemaDef['filters'][number],
              };
            }
          }

          return acc;
        }, searchQueryFilters);

      form.setFieldValue('filters', filtersFormDefaultValues);
    },
    placeholderData: [],
    requestArgs: { id: collectionId },
  });

  return (
    <div className="grid gap-5">
      {filterOptions.map((customField) => {
        return (
          <CustomFieldTypeFilter
            customField={customField}
            form={form}
            key={customField.id}
          />
        );
      })}
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
        label: `Select status...`,
        placeholder: true,
        value: null,
      },
      { label: 'True', value: true },
      { label: 'False', value: false },
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

          const isMinEqualToMax =
            customField.range.min === customField.range.max;

          return isMinEqualToMax ? null : (
            <FiltersBlock
              key={customField.id}
              label={customField.name}
              onReset={() => {
                field.handleChange({
                  ...value,
                  range: customField.range,
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
                <Slider.Root
                  max={customField.range.max}
                  min={customField.range.min}
                  onValueChange={([min, max]) => {
                    field.handleChange({
                      ...value,
                      items: undefined,
                      range: {
                        max,
                        min,
                      },
                      value: undefined,
                    });
                  }}
                  value={[value.range.min, value.range.max]}
                >
                  <Slider.Control className="py-2 cursor-pointer data-dragging:cursor-grabbing">
                    <Slider.Track className="bg-gray-500 h-1 w-full">
                      <Slider.Indicator className="bg-primary-700" />
                      <Slider.Thumb
                        aria-label="Minimum value"
                        className="size-3 bg-primary-700 rounded-xl cursor-grab"
                        index={0}
                      />
                      <Slider.Thumb
                        aria-label="Maximum value"
                        className="size-3 bg-primary-700 rounded-xl cursor-grab"
                        index={1}
                      />
                    </Slider.Track>
                  </Slider.Control>
                </Slider.Root>
              </FieldWrapper>
              {value.range.min} - {value.range.max}
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
                      <CheckboxGroupField
                        columns={customField.items.length >= 10 ? 2 : 1}
                        items={customField.items}
                        name={field.name}
                        onValueChange={(selectedItems) => {
                          field.handleChange(selectedItems);
                        }}
                        value={field.value}
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
