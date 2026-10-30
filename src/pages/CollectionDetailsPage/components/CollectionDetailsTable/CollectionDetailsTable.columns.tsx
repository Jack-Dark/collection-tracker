import { createColumnHelper } from '@tanstack/react-table';
import _ from 'lodash';

import type { TableFeaturesDef } from '#/components/Table';

import type { CreateOrUpdateCollectionItemFormRowDataDef } from '../../CollectionDetailsPage.types';
import type { GetCollectionItemsTableColumnsPropsDef } from './CollectionDetailsTable.types';

import { CollectionDetailsActionsCell } from './components/column-cells/CollectionDetailsActionsCell';
import { CollectionDetailsCreatedAtCell } from './components/column-cells/CollectionDetailsCreatedAtCell';
import { CollectionDetailsCustomFieldCell } from './components/column-cells/CollectionDetailsCustomFieldCell';
import { CollectionDetailsEditionCell } from './components/column-cells/CollectionDetailsEditionCell';
import { CollectionDetailsImagesCell } from './components/column-cells/CollectionDetailsImagesCell';
import { CollectionDetailsNameCell } from './components/column-cells/CollectionDetailsNameCell';
import { CollectionDetailsNotesCell } from './components/column-cells/CollectionDetailsNotesCell';

const columnHelper = createColumnHelper<
  TableFeaturesDef,
  CreateOrUpdateCollectionItemFormRowDataDef
>();

export const getCollectionItemsTableColumns = (
  props: GetCollectionItemsTableColumnsPropsDef,
) => {
  const { customFields, form, onCancel, onEditClick } = props;

  const sortedCustomFields = _.sortBy(customFields, ({ order }) => {
    return order;
  });

  return columnHelper.columns([
    columnHelper.accessor('name', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsNameCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Name',
      size: 250,
    }),
    columnHelper.accessor('images', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsImagesCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Images',
      size: 250,
    }),
    ...sortedCustomFields.map(({ customField }) => {
      return columnHelper.accessor('customFieldValues', {
        cell: ({ row }) => {
          return (
            <CollectionDetailsCustomFieldCell
              customField={customField}
              form={form}
              rowId={row.id}
              rowIndex={row.index}
            />
          );
        },
        header: customField.name,
        id: String(customField.id),
        minSize:
          customField.type === 'boolean'
            ? 100
            : customField.type === 'number'
              ? 100
              : 250,
      });
    }),
    columnHelper.accessor('editionDetails', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsEditionCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Edition',
      size: 200,
    }),
    columnHelper.accessor('notes', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsNotesCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Notes',
      size: 250,
    }),
    columnHelper.accessor('createdAt', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsCreatedAtCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Added',
    }),
    columnHelper.accessor('id', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsActionsCell
            form={form}
            onCancel={onCancel}
            onEditClick={onEditClick}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: '',
      id: 'actions',
      maxSize: 40,
    }),
  ]);
};
