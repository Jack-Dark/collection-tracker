import { useParams } from '@tanstack/react-router';

import { useDeleteCollectionItemsByIds } from '#/api/routes/collection-items/delete-collection-items-by-ids/delete-collection-items-by-ids.react-query';
import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { TableCellActionsMenu } from '#/components/TableCellActionsMenu';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

import type { CollectionDetailsActionsCellPropsDef } from './CollectionDetailsActionsCell.types';

export const CollectionDetailsActionsCell = (
  props: CollectionDetailsActionsCellPropsDef,
) => {
  const { form, onCancel, onEditClick, rowId, rowIndex } = props;

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { id } = useParams({ from: '/_protected/collections/$id' });
  const collectionId = Number(id);

  const { isPending: isDeletePending, onDeleteCollectionItemsByIds } =
    useDeleteCollectionItemsByIds({
      onSuccess: async () => {
        await invalidateGetCollectionDetailsById({
          id: collectionId,
        });
      },
    });

  const { getHasNewRecord, getIsEditingRowId, isEditing } =
    useEditingCollectionItemsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);

  const isCreatingRecord = getHasNewRecord();

  return (
    <form.Field name={`collectionItems[${rowIndex}]`}>
      {(field) => {
        const rowData = field.value;

        return (
          <TableCellActionsMenu
            deleteIsDisabled={isEditing || isDeletePending}
            deleteOnClick={async () => {
              if (typeof rowData.id === 'number') {
                await onDeleteCollectionItemsByIds({
                  collectionItemIds: [rowData.id],
                });
              }
            }}
            editIsDisabled={isCreatingRecord || isDeletePending}
            editOnClick={({ id }) => {
              onEditClick(String(id));
            }}
            isEditing={isEditingRow}
            onCancelEdit={onCancel}
            rowData={rowData}
          />
        );
      }}
    </form.Field>
  );
};
