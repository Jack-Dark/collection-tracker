import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAppHotkeys, useHotkeys } from '@tanstack/react-hotkeys';
import { useRef } from 'react';

import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useDeleteCollectionById } from '#/api/routes/collections/delete-collection-by-id/delete-collection-by-id.react-query';
import { Button } from '#/components/Button';
import { ConfirmDeleteDialog } from '#/components/ConfirmDeleteDialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { Popover } from '#/components/Popover';
import { useUserContext } from '#/hooks/use-user-context';
import { verifyEmailMessage } from '#/layout';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import { AddNewCollectionButton } from './components/AddNewCollectionButton';
import { CollectionsListSubmitButton } from './components/CollectionsListSubmitButton';

export const CollectionsListAboveTableActions = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  onCancel: () => void;
  resetRowSelection: () => void;
  /** Array of the `string` versions of the row data's `id` values. */
  selectedRowIds: string[];
}) => {
  const { form, onCancel, resetRowSelection, selectedRowIds } = props;

  const user = useUserContext();

  const { addToEditingRowIds, isEditing } = useEditingCollectionsRowIds();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { onDeleteCollectionById } = useDeleteCollectionById({
    onSuccess: async (_response, { ids }) => {
      await Promise.all(
        ids.map(async (id) => {
          await invalidateGetCollectionDetailsById({
            id,
          });
        }),
      );
      resetRowSelection();
    },
  });

  const [showConfirmDeleteDialog, hideConfirmDeleteDialog] = useDialog(() => {
    const numSelectedRows = selectedRowIds.length;

    const onConfirm = async () => {
      await onDeleteCollectionById({
        ids: selectedRowIds.map((id) => {
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
            ? `${numSelectedRows} collections`
            : 'this collection'}
          ?
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
    <form.ArrayField name="records">
      {() => {
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
                    Icon={ClearIcon}
                    onClick={onCancel}
                    text="Cancel"
                    variant="mono"
                  />
                  <CollectionsListSubmitButton
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
                      <AddNewCollectionButton
                        className="btn-sm md:btn-md"
                        disabled={!user?.emailVerified}
                        form={form}
                        insertAtIndex={0}
                        ref={addNewBtnRef}
                      >
                        <span>
                          Add{' '}
                          <span className="sr-only md:not-sr-only">New</span>
                        </span>
                      </AddNewCollectionButton>
                    );
                  }}
                />
              )}
            </div>
          </div>
        );
      }}
    </form.ArrayField>
  );
};
