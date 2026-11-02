import SaveIcon from '@mui/icons-material/Save';

import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { Button } from '#/components/Button';
import { HotkeyPopover } from '#/components/HotkeyPopover';

export const CollectionsListSubmitButton = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  resetRowSelection: () => void;
}) => {
  const { form, resetRowSelection } = props;

  return (
    <form.Subscribe
      selector={({ isPristine, isSubmitting, isValid }) => {
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
              onClick={(e) => {
                e.preventDefault();

                form.handleSubmit();
                resetRowSelection();
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
