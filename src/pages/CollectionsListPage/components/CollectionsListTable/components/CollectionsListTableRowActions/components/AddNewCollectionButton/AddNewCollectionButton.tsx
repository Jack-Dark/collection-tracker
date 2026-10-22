import AddIcon from '@mui/icons-material/Add';
import { useHotkeys } from '@tanstack/react-hotkeys';
import { useRef } from 'react';

import type { ButtonPropsDef } from '#/components/Button';
import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { Button } from '#/components/Button';
import { hotkeys } from '#/constants/hotkeys';
import { createNewCollection } from '#/pages/CollectionsListPage/CollectionsListPage.form';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const AddNewCollectionButton = (
  props: {
    form: CreateOrUpdateCollectionFormTypeDef;
    insertAtIndex: number;
  } & ButtonPropsDef,
) => {
  const { form, insertAtIndex, ...buttonProps } = props;

  const { addToEditingRowIds } = useEditingCollectionsRowIds();

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
    <form.ArrayField name="records">
      {(recordsField) => {
        return (
          <Button
            {...buttonProps}
            Icon={AddIcon}
            onClick={() => {
              const newCollectionItem = createNewCollection();

              recordsField.insertValue(insertAtIndex, newCollectionItem);

              addToEditingRowIds(newCollectionItem.id);
            }}
            ref={addAnotherBtnRef}

            variant="secondary"
          />
        );
      }}
    </form.ArrayField>
  );
};
