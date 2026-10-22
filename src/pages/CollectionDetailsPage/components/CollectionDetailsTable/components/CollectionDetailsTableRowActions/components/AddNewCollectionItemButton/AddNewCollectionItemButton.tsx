import AddIcon from '@mui/icons-material/Add';
import { useHotkeys } from '@tanstack/react-hotkeys';
import { useRef } from 'react';

import type { ButtonPropsDef } from '#/components/Button';
import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { Button } from '#/components/Button';
import { hotkeys } from '#/constants/hotkeys';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

import { useCreateNewCollectionItem } from '../../../../../../CollectionDetailsPage.form';

export const AddNewCollectionItemButton = ({
  children: _children,
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

  useHotkeys([
    {
      callback: async () => {
        addAnotherBtnRef.current?.click();
      },
      hotkey: hotkeys.new,
      options: {
        ignoreInputs: false,
        preventDefault: true,
        stopPropagation: true,
      },
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
            text="Another"
            variant="secondary"
            {...buttonProps}
          />
        );
      }}
    </form.ArrayField>
  );
};
