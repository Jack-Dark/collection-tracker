import AddIcon from '@mui/icons-material/Add';
import { useAppHotkeys, useHotkeys } from '@tanstack/react-hotkeys';
import { useRef } from 'react';

import type { ButtonPropsDef } from '#/components/Button';
import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { Button } from '#/components/Button';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

import { useCreateNewCollectionItem } from '../../../../../../CollectionDetailsPage.form';

export const AddNewCollectionItemButton = ({
  form,
  insertAtIndex,
  ...buttonProps
}: ButtonPropsDef & {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  insertAtIndex: number;
}) => {
  const { addToEditingRowIds } = useEditingCollectionItemsRowIds();

  const createNewCollectionItem = useCreateNewCollectionItem();

  const addAnotherBtnRef = useRef<HTMLButtonElement>(null);

  const appHotkeys = useAppHotkeys();

  useHotkeys([
    {
      callback: () => {
        addAnotherBtnRef.current?.click();
      },
      hotkey: appHotkeys['app.new'],
    },
  ]);

  return (
    <form.ArrayField name="collectionItems">
      {(collectionItemsField) => {
        return (
          <Button
            Icon={AddIcon}
            onClick={async () => {
              const newCollectionItem = await createNewCollectionItem();

              collectionItemsField.insertValue(
                insertAtIndex,
                newCollectionItem,
              );

              addToEditingRowIds(newCollectionItem.id);
            }}
            ref={addAnotherBtnRef}
            variant="secondary"
            {...buttonProps}
          />
        );
      }}
    </form.ArrayField>
  );
};
