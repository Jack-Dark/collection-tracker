import SaveIcon from '@mui/icons-material/Save';

import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { Button } from '#/components/Button';

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
