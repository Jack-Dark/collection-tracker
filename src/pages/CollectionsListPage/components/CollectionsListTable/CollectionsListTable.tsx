import { useEffect, useMemo } from 'react';

import { getPaginationMetadataDefaults } from '#/api/pagination/pagination.constants';
import {
  useGetPaginatedCollections,
  useInvalidateGetPaginatedCollections,
} from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { Table } from '#/components/Table';
import { Route as CollectionsRoute } from '#/routes/_protected/collections';

import type { CreateOrUpdateCollectionFormTypeDef } from '../../CollectionsListPage.types';

import { useEditingCollectionsRowIds } from '../../hooks/use-editing-collections-row-ids';
import { getCollectionsListTableColumns } from './CollectionsListTable.columns';
import { CollectionsListAboveTableActions } from './components/CollectionsListAboveTableActions';
import { useCollectionsListPaginationProps } from './hooks/use-collections-list-pagination-props';
import { useCollectionsListSearchProps } from './hooks/use-collections-list-search-props';
import { useCollectionsListSortProps } from './hooks/use-collections-list-sort-props';

export const CollectionsListTable = ({
  form,
}: {
  form: CreateOrUpdateCollectionFormTypeDef;
}) => {
  const searchQueries = CollectionsRoute.useSearch();

  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const { data } = useGetPaginatedCollections({
    placeholderData: {
      collections: [],
      pagination: getPaginationMetadataDefaults(1000),
    },
    requestArgs: { params: searchQueries },
  });

  const { pagination } = data;

  const onCancel = () => {
    // ? Reset form to immediately clear changes
    form.reset();
    // ? invalidate to solve edge case of deleting a currently applied custom field and then cancelling your changes leaving the old field data in the table
    invalidateGetPaginatedCollections();

    resetEditingRowIds();
  };

  const { addToEditingRowIds, editingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionsRowIds();

  const columns = useMemo(() => {
    return getCollectionsListTableColumns({
      form,
      onCancel,
      onEditClick: addToEditingRowIds,
    });
  }, [editingRowIds]);

  const searchProps = useCollectionsListSearchProps();
  const paginationProps = useCollectionsListPaginationProps({ pagination });
  const sortProps = useCollectionsListSortProps();

  useEffect(() => {
    // ? clear edit state on unmount
    return resetEditingRowIds;
  }, []);

  return (
    <form.Field name="records">
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
                <CollectionsListAboveTableActions
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
            pagination={paginationProps}
            search={searchProps}
            showRowSelection
            sort={sortProps}
          />
        );
      }}
    </form.Field>
  );
};
