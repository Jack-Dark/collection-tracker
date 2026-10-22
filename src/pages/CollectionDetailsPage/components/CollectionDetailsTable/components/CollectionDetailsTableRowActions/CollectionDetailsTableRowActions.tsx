import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useHotkeys, useAppHotkeys } from '@tanstack/react-hotkeys';
import { useRef } from 'react';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { useDeleteCollectionItemsByIds } from '#/api/routes/collection-items/delete-collection-items-by-ids/delete-collection-items-by-ids.react-query';
import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { Button } from '#/components/Button';
import { ConfirmDeleteDialog } from '#/components/ConfirmDeleteDialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { Popover } from '#/components/Popover';
import { pluralize } from '#/helpers/pluralize';
import { useUserContext } from '#/hooks/use-user-context';
import { verifyEmailMessage } from '#/layout';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useEditingCollectionItemsRowIds } from '../../../../hooks/use-editing-collection-items-row-ids';
import { AddNewCollectionItemButton } from './components/AddNewCollectionItemButton';
import { CollectionDetailsSubmitButton } from './components/CollectionDetailsSubmitButton';

// TODO - IMPROVEMENT: RENAME TO SOMETHING MORE APPROPRIATE
export const CollectionDetailsTableRowActions = ({
  form,
  onCancel,
  resetRowSelection,
  /** Array of the `string` versions of the row data's `id` values. */
  selectedRowIds,
}: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  onCancel: () => void;
  resetRowSelection: () => void;
  selectedRowIds: string[];
}) => {
  const { id } = CollectionRoute.useParams();
  const collectionId = Number(id);

  const user = useUserContext();

  const { addToEditingRowIds, isEditing } = useEditingCollectionItemsRowIds();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { onDeleteCollectionItemsByIds } = useDeleteCollectionItemsByIds({
    onSuccess: async () => {
      await invalidateGetCollectionDetailsById({
        id: collectionId,
      });
      resetRowSelection();
    },
  });

  const [showConfirmDeleteDialog, hideConfirmDeleteDialog] = useDialog(() => {
    const numSelectedRows = selectedRowIds.length;

    const onConfirm = async () => {
      await onDeleteCollectionItemsByIds({
        collectionItemIds: selectedRowIds.map((id) => {
          return Number(id);
        }),
      });
    };

    return (
      <ConfirmDeleteDialog
        hideDialog={hideConfirmDeleteDialog}
        onConfirm={onConfirm}
      >
        <p className="text-center">
          Are you sure you want to delete{' '}
          {selectedRowIds.length > 1
            ? `${numSelectedRows} ${pluralize('item', numSelectedRows)}`
            : 'this item'}{' '}
          from your collection?
        </p>
      </ConfirmDeleteDialog>
    );
  }, [selectedRowIds]);

  const addNewBtnRef = useRef<HTMLButtonElement>(null);

  const appHotkeys = useAppHotkeys();

  useHotkeys([
    {
      callback: () => {
        addNewBtnRef.current?.click();
      },
      hotkey: appHotkeys['app.new'],
    },
  ]);

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        {!!selectedRowIds.length && (
          <>
            <Button
              className="btn-sm md:btn-md"
              disabled={isEditing}
              Icon={EditIcon}
              onClick={() => {
                addToEditingRowIds(...selectedRowIds);
              }}
              variant="secondary"
            >
              <span className="sr-only md:not-sr-only">Edit</span>
            </Button>

            <Button
              className="btn-sm md:btn-md"
              disabled={isEditing}
              Icon={DeleteIcon}
              onClick={showConfirmDeleteDialog}
              variant="alert"
            >
              <span className="sr-only md:not-sr-only">Delete</span>
            </Button>
          </>
        )}
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              className="btn-sm md:btn-md"
              Icon={ClearIcon}
              onClick={onCancel}
              text="Cancel"
              variant="mono"
            />
            <CollectionDetailsSubmitButton
              form={form}
              resetRowSelection={resetRowSelection}
            />
          </>
        ) : (
          <Popover
            Description={verifyEmailMessage}
            disabled={user?.emailVerified}
            isTriggerButton
            Trigger={() => {
              return (
                <AddNewCollectionItemButton
                  className="btn-sm md:btn-md"
                  disabled={!user?.emailVerified}
                  form={form}
                  insertAtIndex={0}
                  ref={addNewBtnRef}
                >
                  <span>
                    Add <span className="sr-only md:not-sr-only">New</span>
                  </span>
                </AddNewCollectionItemButton>
              );
            }}
          />
        )}
      </div>
    </div>
  );
};
