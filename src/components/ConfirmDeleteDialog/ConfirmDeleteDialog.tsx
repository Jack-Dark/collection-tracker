import type { ConfirmDeleteDialogPropsDef } from './ConfirmDeleteDialog.types';

import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { FormSubmitButton } from '../FormSubmitButton';
import { useSpinner } from '../FullPageLoadingSpinner/useSpinner';

export const ConfirmDeleteDialog = (props: ConfirmDeleteDialogPropsDef) => {
  const {
    children = 'Are you sure you want to delete this?',
    form,
    Header = 'Confirm Delete',
    hideDialog,
    onConfirm,
    submitText = 'Delete',
  } = props;

  const { onInterceptProcessingRequest, processing } = useSpinner();

  const handleConfirm = async () => {
    await onInterceptProcessingRequest(async () => {
      await onConfirm?.();
      hideDialog();
    });
  };

  return (
    <Dialog
      disableOnClose={processing}
      Footer={() => {
        return (
          <>
            <Button
              disabled={processing}
              onClick={hideDialog}
              text="Cancel"
              variant="mono"
            />
            {form ? (
              <FormSubmitButton form={form} text="Delete" variant="alert" />
            ) : (
              <Button
                onClick={handleConfirm}
                processing={processing}
                text={submitText}
                variant="alert"
              />
            )}
          </>
        );
      }}
      Header={Header}
      onClose={hideDialog}
    >
      {children}
    </Dialog>
  );
};
