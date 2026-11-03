import SaveIcon from '@mui/icons-material/Save';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { Button } from '#/components/Button';
import { HotkeyPopover } from '#/components/HotkeyPopover';

export const CollectionDetailsSubmitButton = ({
  form,
  resetRowSelection,
}: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  resetRowSelection: () => void;
}) => {
  return (
    <form.Subscribe
      selector={(state) => {
        const { isPristine, isSubmitting, isValid } = state;

        return {
          isPristine,
          isSubmitting,
          isValid,
        };
      }}
    >
      {({ isPristine, isSubmitting, isValid }) => {
        const disabled = isPristine || !isValid;

        return (
          <HotkeyPopover disabled={disabled} hotkey="save" isTriggerButton>
            <Button
              className="flex flex-nowrap gap-2 btn-sm md:btn-md"
              disabled={disabled}
              Icon={SaveIcon}
              onClick={async (e) => {
                e.preventDefault();

                const errors = await form.handleSubmit();
                if (!errors?.length) {
                  resetRowSelection();
                }
              }}
              processing={isSubmitting}
              text="Save"
              type="submit"
            />
          </HotkeyPopover>
        );
      }}
    </form.Subscribe>
  );
};
