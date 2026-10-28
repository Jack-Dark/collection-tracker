import { useForm } from '@tanstack/react-form';
import { Suspense, useEffect, useMemo } from 'react';

import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useDeleteUnusedCustomFieldValues } from '#/api/routes/custom-field-values/delete-unused-custom-field-values/delete-unused-custom-field-values.react-query';
import { LoadingSpinner } from '#/components/FullPageLoadingSpinner/components/LoadingSpinner';
import { Table } from '#/components/Table';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import {
  useCollectionDetailsForm,
  useHandleGetCollectionDetailsById,
} from '../../CollectionDetailsPage';
import { useEditingCollectionItemsRowIds } from '../../hooks/use-editing-collection-items-row-ids';
import { useOnUpdateCollectionItemsQueries } from '../../hooks/use-on-update-collection-items-queries';
import { getCollectionItemsTableColumns } from './CollectionDetailsTable.columns';
import { CollectionDetailsTableRowActions } from './components/CollectionDetailsTableRowActions';
import { CollectionDetailsFiltersContent } from './components/CollectionItemsFiltersContent';
import {
  collectionItemsFiltersFormOptions,
  getIsFilterValueApplied,
  useCollectionDetailsFiltersProps,
} from './hooks/use-collection-details-filters-props';
import { useCollectionDetailsPaginationProps } from './hooks/use-collection-details-pagination-props';
import { useCollectionDetailsSearchProps } from './hooks/use-collection-details-search-props';
import { useCollectionDetailsSettingsProps } from './hooks/use-collection-details-settings-props';
import { useCollectionDetailsSortProps } from './hooks/use-collection-details-sort-props';

export const CollectionDetailsTable = () => {
  const { id } = CollectionRoute.useParams();
  const collectionId = Number(id);
  const search = CollectionRoute.useSearch();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { data } = useHandleGetCollectionDetailsById();

  const { onDeleteUnusedCustomFieldValues } =
    useDeleteUnusedCustomFieldValues();

  const { form, resetForm } = useCollectionDetailsForm();

  const onCancel = async () => {
    resetEditingRowIds();
    // ? Reset form to immediately clear changes
    resetForm();

    await Promise.all([
      // TODO - IMPROVEMENT: CREATE SEPARATE `shouldInvalidate` state which will trigger the invalidation conditionally
      // ? invalidate to solve edge case of deleting a currently applied custom field value and then cancelling your changes leaving the old custom field value in the table
      invalidateGetCollectionDetailsById(),
      onDeleteUnusedCustomFieldValues({ collectionId }),
    ]);
  };

  const { addToEditingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const columns = useMemo(() => {
    return getCollectionItemsTableColumns({
      customFields: data.collection?.customFields || [],
      form,
      onCancel,
      onEditClick: addToEditingRowIds,
    });
  }, [data.collection?.customFields]);

  const { onUpdateCollectionItemsQueries } =
    useOnUpdateCollectionItemsQueries();

  const filtersForm = useForm({
    ...collectionItemsFiltersFormOptions,
    defaultValues: { filters: search.filters },
    onSubmit: ({ value }) => {
      // ? Only include non-empty filters
      const submissionValues = Object.entries(value.filters).reduce<
        typeof value.filters
      >((acc, [customFieldStringId, filterValue]) => {
        const customFieldId = Number(customFieldStringId);
        const isApplied = getIsFilterValueApplied(filterValue);

        if (isApplied) {
          return { ...acc, [customFieldId]: filterValue };
        } else {
          return acc;
        }
      }, {});

      onUpdateCollectionItemsQueries({
        filters: submissionValues,
      });
    },
  });

  const filtersProps = useCollectionDetailsFiltersProps({
    form: filtersForm,
  });
  const searchProps = useCollectionDetailsSearchProps();
  const paginationProps = useCollectionDetailsPaginationProps({
    pagination: data.pagination,
  });
  const sortProps = useCollectionDetailsSortProps();
  const settingsProps = useCollectionDetailsSettingsProps();

  useEffect(() => {
    // ? clear edit state on unmount
    return resetEditingRowIds;
  }, []);

  return (
    <form.Field name="collectionItems">
      {(field) => {
        return (
          <Table
            AboveTableComponent={({ table }) => {
              const selectedRowIds = table
                .getSelectedRowModel()
                .rows.map(({ id }) => {
                  return id;
                });

              return (
                <CollectionDetailsTableRowActions
                  form={form}
                  onCancel={onCancel}
                  resetRowSelection={table.resetRowSelection}
                  selectedRowIds={selectedRowIds}
                />
              );
            }}
            columns={columns}
            data={field.value}
            disableRowSelection={isEditing}
            filters={{
              ...filtersProps,
              FiltersContent: () => {
                return (
                  <Suspense
                    fallback={
                      <div className="flex justify-center">
                        <LoadingSpinner className="size-15" variant="color" />
                      </div>
                    }
                  >
                    <CollectionDetailsFiltersContent
                      collectionId={collectionId}
                      form={filtersForm}
                    />
                  </Suspense>
                );
              },
            }}
            pagination={paginationProps}
            search={searchProps}
            settings={settingsProps}
            showRowSelection
            sort={sortProps}
          />
        );
      }}
    </form.Field>
  );
};
