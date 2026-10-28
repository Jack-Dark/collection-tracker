import ClearIcon from '@mui/icons-material/Clear';
import { useAppHotkeys, useHotkeys } from '@tanstack/react-hotkeys';
import formatDate, { masks } from 'dateformat';
import { useRef } from 'react';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { Button } from '#/components/Button';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

import { AddNewCollectionItemButton } from '../../CollectionDetailsTableRowActions/components/AddNewCollectionItemButton';

export const CollectionDetailsCreatedAtCell = ({
  form,
  rowId,
  rowIndex,
}: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
}) => {
  const { getHasNewRecord, getIsEditingRowId } =
    useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  const { getLastNewRecordIndex, removeFromEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const isLastNewRecordIndex = getLastNewRecordIndex() === rowIndex;

  const showNewRecordButtons = isEditingRow && getHasNewRecord();

  const removeBtnRef = useRef<HTMLButtonElement>(null);

  const appHotkeys = useAppHotkeys();

  useHotkeys([
    {
      callback: () => {
        removeBtnRef.current?.click();
      },
      hotkey: appHotkeys['app.remove-last'],
      options: {
        enabled: showNewRecordButtons && isLastNewRecordIndex,
      },
    },
  ]);

  return (
    <form.ArrayField name="collectionItems">
      {(collectionItemsField) => {
        return (
          <div className="grid gap-2 justify-start">
            <form.Field name={`collectionItems[${rowIndex}]`}>
              {({ value }) => {
                if (!value) {
                  return null;
                }

                return showNewRecordButtons ? (
                  <>
                    <Button
                      Icon={ClearIcon}
                      onClick={() => {
                        collectionItemsField.removeValue(rowIndex);
                        removeFromEditingRowIds(String(value.id));
                      }}
                      ref={removeBtnRef}
                      text="Remove"
                      variant="mono"
                    />

                    {isLastNewRecordIndex && (
                      <AddNewCollectionItemButton
                        form={form}
                        insertAtIndex={rowIndex + 1}
                      >
                        <span className="sr-only md:not-sr-only">Another</span>
                      </AddNewCollectionItemButton>
                    )}
                  </>
                ) : (
                  <p>{formatDate(value.createdAt, masks.paddedShortDate)}</p>
                );
              }}
            </form.Field>
          </div>
        );
      }}
    </form.ArrayField>
  );
};
