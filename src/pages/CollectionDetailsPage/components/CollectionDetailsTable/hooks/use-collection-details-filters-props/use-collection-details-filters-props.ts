import type { ReactFormType } from '@tanstack/react-form';

import { formOptions } from '@tanstack/react-form';
import { useSearch } from '@tanstack/react-router';
import z from 'zod';

import type { collectionDetailsFilterValueSchema } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.schema';
import type { FiltersButtonPropsDef } from '#/components/Table/components/FilterButton/FilterButton.types';

import { collectionDetailsFiltersSchema } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.schema';

export type CollectionItemsFilterValueSchemaDef = z.output<
  typeof collectionDetailsFilterValueSchema
>;

const collectionItemFiltersFormSchema = z.object({
  filters: collectionDetailsFiltersSchema,
});

export type CollectionItemsFiltersFormSchemaDef = z.output<
  typeof collectionItemFiltersFormSchema
>;

export const collectionItemsFiltersFormEmptyDefaults: CollectionItemsFiltersFormSchemaDef =
  { filters: {} };

export const collectionItemsFiltersFormOptions = formOptions({
  defaultValues: collectionItemsFiltersFormEmptyDefaults,
  formId: 'collection-item-filters',
  validators: [
    {
      run: collectionItemFiltersFormSchema,
      triggers: ['change'],
    },
  ],
});

export type CollectionItemsFiltersFormDef = ReactFormType<
  typeof collectionItemsFiltersFormOptions
>;

export const getIsFilterValueApplied = (
  filterValue: CollectionItemsFilterValueSchemaDef,
) => {
  const { items, rangeMax, rangeMin, value } = filterValue;

  return (
    !!items?.length ||
    !!rangeMax ||
    !!rangeMin ||
    (value !== null && value !== undefined)
  );
};

export const useCollectionDetailsFiltersProps = (props: {
  form: CollectionItemsFiltersFormDef;
}) => {
  const { form } = props;
  const { filters: searchQueryFilters } = useSearch({
    from: '/_protected/collections/$id',
  });

  const numApplied = Object.values(searchQueryFilters).filter(
    getIsFilterValueApplied,
  ).length;

  return {
    numApplied,
    onCancel: () => {
      form.setFieldValue('filters', searchQueryFilters);
    },
    onReset: async () => {
      form.setFieldValue(
        'filters',
        collectionItemsFiltersFormEmptyDefaults.filters,
      );
      await form.handleSubmit();
    },
    onSubmit: async () => {
      await form.handleSubmit();
    },
  } satisfies Omit<FiltersButtonPropsDef, 'FiltersContent'>;
};
