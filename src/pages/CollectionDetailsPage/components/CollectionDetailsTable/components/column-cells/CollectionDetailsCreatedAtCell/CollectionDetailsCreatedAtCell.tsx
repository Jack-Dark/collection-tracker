import ClearIcon from '@mui/icons-material/Clear';
import formatDate, { masks } from 'dateformat';

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

  return (
    <form.ArrayField name="collectionItems">
      {(collectionItemsField) => {
        return (
          <div className="grid gap-2 justify-start">
            <form.Field name={`collectionItems[${rowIndex}]`}>
              {({ value }) => {
                return showNewRecordButtons ? (
                  <>
                    <Button
                      Icon={ClearIcon}
                      onClick={() => {
                        collectionItemsField.removeValue(rowIndex);
                        removeFromEditingRowIds(String(value.id));
                      }}
                      text="Remove"
                      variant="mono"
                    />

                    {isLastNewRecordIndex && (
                      <AddNewCollectionItemButton
                        form={form}
                        insertAtIndex={rowIndex + 1}
                      />
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
