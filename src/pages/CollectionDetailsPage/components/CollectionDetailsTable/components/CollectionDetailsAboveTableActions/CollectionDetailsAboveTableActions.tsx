import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InsightsIcon from '@mui/icons-material/Insights';
import {
  useHotkeys,
  useAppHotkeys,
  useFormatForDisplay,
} from '@tanstack/react-hotkeys';
import { Link, useParams } from '@tanstack/react-router';
import { useSelector } from '@tanstack/react-store';
import { useRef } from 'react';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { useDeleteCollectionItemsByIds } from '#/api/routes/collection-items/delete-collection-items-by-ids/delete-collection-items-by-ids.react-query';
import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { Button } from '#/components/Button';
import { ConfirmDeleteDialog } from '#/components/ConfirmDeleteDialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { Popover } from '#/components/Popover';
import { hotkeys } from '#/constants/app-hotkeys';
import { pluralize } from '#/helpers/pluralize';
import { verifyEmailMessage } from '#/layout';
import { useAuth } from '#/providers/AuthProvider';

import { useEditingCollectionItemsRowIds } from '../../../../hooks/use-editing-collection-items-row-ids';
import { AddNewCollectionItemButton } from './components/AddNewCollectionItemButton';
import { CollectionDetailsSubmitButton } from './components/CollectionDetailsSubmitButton';

export const CollectionDetailsAboveTableActions = ({
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
  const { id } = useParams({ from: '/_protected/collections/$id' });
  const collectionId = Number(id);

  const { user } = useAuth();

  const { addToEditingRowIds, isEditing } = useEditingCollectionItemsRowIds();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { onDeleteCollectionItemsByIds } = useDeleteCollectionItemsByIds({
    onSuccess: async () => {
      resetRowSelection();

      await invalidateGetCollectionDetailsById({
        id: collectionId,
      });
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

  const formatHotkey = useFormatForDisplay();
  const formattedNewHotkey = formatHotkey(hotkeys.new);

  const showStatsButton = useSelector(form.atom, ({ values }) => {
    return values.collectionItems.some(({ customFieldValues }) => {
      return !!Object.values(customFieldValues).length;
    });
  });

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              icon={<ClearIcon />}
              onClick={async () => {
                resetRowSelection();

                await onCancel();
              }}
              text="Cancel"
              variant="mono"
            />
            <CollectionDetailsSubmitButton
              form={form}
              resetRowSelection={resetRowSelection}
            />
          </>
        ) : (
          !!selectedRowIds.length && (
            <>
              <Button
                disabled={isEditing}
                icon={<EditIcon />}
                onClick={() => {
                  addToEditingRowIds(...selectedRowIds);
                }}
                variant="secondary"
              >
                <span className="sr-only md:not-sr-only">Edit</span>
              </Button>

              <Button
                disabled={isEditing}
                icon={<DeleteIcon />}
                onClick={showConfirmDeleteDialog}
                variant="alert"
              >
                <span className="sr-only md:not-sr-only">Delete</span>
              </Button>
            </>
          )
        )}
      </div>

      <div className="flex gap-2">
        {!isEditing && (
          <Popover
            Description={
              user?.emailVerified
                ? `Hotkey: ${formattedNewHotkey}`
                : verifyEmailMessage
            }
            isTriggerButton
            Trigger={() => {
              return (
                <AddNewCollectionItemButton
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

        {showStatsButton && (
          <Link params={{ id }} to="/collections/$id/stats">
            <Button icon={<InsightsIcon />} text="Stats" variant="mono" />
          </Link>
        )}
      </div>
    </div>
  );
};
