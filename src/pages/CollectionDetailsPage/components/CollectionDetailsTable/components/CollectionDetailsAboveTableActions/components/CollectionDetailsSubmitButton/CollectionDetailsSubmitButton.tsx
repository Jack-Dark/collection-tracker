import SaveIcon from '@mui/icons-material/Save';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { Button } from '#/components/Button';

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
        return (
          <Button
            className="flex flex-nowrap gap-2"
            disabled={isPristine || !isValid}
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
        );
      }}
    </form.Subscribe>
  );
};
