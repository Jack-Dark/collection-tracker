import ClearIcon from '@mui/icons-material/Clear';
import { useAppHotkeys, useHotkeys } from '@tanstack/react-hotkeys';
import formatDate, { masks } from 'dateformat';
import { useRef } from 'react';

import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { Button } from '#/components/Button';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

import { AddNewCollectionButton } from '../../CollectionsListTableRowActions/components/AddNewCollectionButton';

export const CollectionsListCreatedAtCell = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  index: number;
  rowId: string;
  value: string;
}) => {
  const { form, index, rowId, value } = props;

  const {
    getHasNewRecord,
    getIsEditingRowId,
    getLastNewRecordIndex,
    removeFromEditingRowIds,
  } = useEditingCollectionsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);
  const showNewRecordButtons = isEditingRow && getHasNewRecord();
  const isLastNewRecordIndex = getLastNewRecordIndex() === index;

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

  return showNewRecordButtons ? (
    <form.ArrayField name="records">
      {(recordsField) => {
        return (
          <div className="grid gap-2 justify-start">
            <form.Field name={`records[${index}]`}>
              {() => {
                return (
                  <>
                    <Button
                      Icon={ClearIcon}
                      onClick={() => {
                        recordsField.removeValue(index);
                        removeFromEditingRowIds(rowId);
                      }}
                      text="Remove"
                      variant="mono"
                    />

                    {isLastNewRecordIndex && (
                      <form.Subscribe
                        selector={({ isPristine, isValid }) => {
                          return {
                            isPristine,
                            isValid,
                          };
                        }}
                      >
                        {({ isPristine, isValid }) => {
                          return (
                            <AddNewCollectionButton
                              disabled={isPristine || !isValid}
                              form={form}
                              insertAtIndex={index + 1}
                              text="Another"
                            />
                          );
                        }}
                      </form.Subscribe>
                    )}
                  </>
                );
              }}
            </form.Field>
          </div>
        );
      }}
    </form.ArrayField>
  ) : (
    <p>{formatDate(value, masks.paddedShortDate)}</p>
  );
};
