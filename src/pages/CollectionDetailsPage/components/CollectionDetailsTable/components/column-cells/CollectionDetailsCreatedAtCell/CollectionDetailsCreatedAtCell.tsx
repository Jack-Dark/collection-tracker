import ClearIcon from '@mui/icons-material/Clear';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { Button } from '#/components/Button';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

import { useFormattedDate } from '../../../../../../../hooks/use-formatted-date';
import { AddNewCollectionItemButton } from '../../CollectionDetailsAboveTableActions/components/AddNewCollectionItemButton';

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
                const formattedDate = useFormattedDate(value?.createdAt);

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
                  <p>{formattedDate}</p>
                );
              }}
            </form.Field>
          </div>
        );
      }}
    </form.ArrayField>
  );
};
