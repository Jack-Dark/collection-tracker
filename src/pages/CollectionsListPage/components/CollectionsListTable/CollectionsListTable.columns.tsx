import InfoIcon from '@mui/icons-material/Info';
import { createColumnHelper } from '@tanstack/react-table';

import type { TableFeaturesDef } from '#/components/Table';

import { Popover } from '#/components/Popover';

import type {
  CreateOrUpdateCollectionFormRecordDef,
  CreateOrUpdateCollectionFormTypeDef,
} from '../../CollectionsListPage.types';

import { CollectionsListActionsCell } from './components/column-cells/CollectionsListActionsCell';
import { CollectionsListCustomFieldsCell } from './components/column-cells/CollectionsListCustomFieldsCell';
import { CollectionsListNameCell } from './components/column-cells/CollectionsListNameCell/CollectionsListNameCell';
import { CollectionsListNotesCell } from './components/column-cells/CollectionsListNotesCell/CollectionsListNotesCell';

const columnHelper = createColumnHelper<
  TableFeaturesDef,
  CreateOrUpdateCollectionFormRecordDef
>();

export type GetCollectionsListTableColumnsPropsDef = {
  form: CreateOrUpdateCollectionFormTypeDef;
  onCancel: () => void;
  onEditClick: (...rowIdsToAdd: string[]) => void;
};

export const getCollectionsListTableColumns = (
  props: GetCollectionsListTableColumnsPropsDef,
) => {
  const { form, onCancel, onEditClick } = props;

  return columnHelper.columns([
    columnHelper.accessor('name', {
      cell: (props) => {
        const { getValue, row } = props;

        return (
          <CollectionsListNameCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
            value={getValue()}
          />
        );
      },
      header: 'Name',
      size: 250,
    }),
    columnHelper.accessor('customFields', {
      cell: ({ row }) => {
        return (
          <CollectionsListCustomFieldsCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: () => {
        return (
          <div className="flex gap-2 items-center">
            <span>Custom Fields</span>
            <Popover
              aria-label="Info icon"
              Description="
              Each custom field will have a unique column on that
              collection's table."
              Trigger={() => {
                return (
                  <InfoIcon
                    className="text-theme-t3 dark:text-theme-t2"
                    fontSize="inherit"
                  />
                );
              }}
            />
          </div>
        );
      },
      minSize: 250,
    }),
    columnHelper.accessor('notes', {
      cell: ({ row }) => {
        return (
          <CollectionsListNotesCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Notes',
      minSize: 250,
    }),
    columnHelper.accessor('id', {
      cell: ({ row }) => {
        return (
          <CollectionsListActionsCell
            onCancel={onCancel}
            onEditClick={onEditClick}
            rowData={row.original}
            rowId={row.id}
          />
        );
      },
      header: '',
      id: 'actions',
      maxSize: 40,
    }),
  ]);
};
