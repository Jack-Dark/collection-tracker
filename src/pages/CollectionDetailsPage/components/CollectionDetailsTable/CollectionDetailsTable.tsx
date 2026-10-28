import { useForm } from '@tanstack/react-form';
import { Suspense, useEffect, useMemo } from 'react';

import { getPaginationMetadataDefaults } from '#/api/pagination/pagination.constants';
import {
  useGetCollectionDetailsById,
  useInvalidateGetCollectionDetailsById,
} from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useGetFiltersForCollection } from '#/api/routes/collection-items/get-filters-for-collection/get-filters-for-collection.react-query';
import { useDeleteUnusedCustomFieldValues } from '#/api/routes/custom-field-values/delete-unused-custom-field-values/delete-unused-custom-field-values.react-query';
import { LoadingSpinner } from '#/components/FullPageLoadingSpinner/components/LoadingSpinner';
import { Table } from '#/components/Table';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../CollectionDetailsPage.types';

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

export const CollectionDetailsTable = ({
  form,
}: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
}) => {
  const { id } = CollectionRoute.useParams();
  const collectionId = Number(id);
  const search = CollectionRoute.useSearch();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { data } = useGetCollectionDetailsById({
    placeholderData: {
      collection: {
        customFields: [],
      },
      pagination: getPaginationMetadataDefaults(),
    },
    requestArgs: { collectionId, params: search },
  });

  const { onDeleteUnusedCustomFieldValues } =
    useDeleteUnusedCustomFieldValues();

  const { pagination } = data;

  const onCancel = async () => {
    // ? Reset form to immediately clear changes
    form.reset();
    // ? invalidate to solve edge case of deleting a currently applied custom field value and then cancelling your changes leaving the old custom field value in the table
    invalidateGetCollectionDetailsById();

    resetEditingRowIds();

    await onDeleteUnusedCustomFieldValues({ collectionId });
  };

  const { addToEditingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const columns = useMemo(() => {
    return getCollectionItemsTableColumns({
      customFields: data?.collection?.customFields || [],
      form,
      onCancel,
      onEditClick: addToEditingRowIds,
    });
  }, [data?.collection?.customFields]);

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

  // TODO - BUG: THIS HOOK NOT NECESSARY, BUT ENTIRE PAGE LOCKS UP IF REMOVED
  useGetFiltersForCollection({
    placeholderData: [],
    requestArgs: { id: collectionId },
  });

  const filtersProps = useCollectionDetailsFiltersProps({
    form: filtersForm,
  });
  const searchProps = useCollectionDetailsSearchProps();
  const paginationProps = useCollectionDetailsPaginationProps({ pagination });
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
                  <CollectionDetailsFiltersContent
                    collectionId={collectionId}
                    form={filtersForm}
                  />
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
