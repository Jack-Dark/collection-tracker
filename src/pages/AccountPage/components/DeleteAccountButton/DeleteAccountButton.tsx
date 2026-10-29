import type { HideDialog } from '#/components/Dialog/hooks/useDialog';

import { useDeleteUser } from '#/api/routes/users/delete-user/delete-user.react-query';
import { Button } from '#/components/Button';
import { ConfirmDeleteDialog } from '#/components/ConfirmDeleteDialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { useNotifications } from '#/components/Notifications/useNotifications';

export const DeleteAccountButton = () => {
  const [showDeleteAccountDialog, hideDeleteAccountDialog] = useDialog(() => {
    return <DeleteAccountDialog hideDialog={hideDeleteAccountDialog} />;
  }, []);

  return (
    <Button
      className="justify-self-start"
      onClick={showDeleteAccountDialog}
      size="sm"
      text="Delete account"
      variant="alert"
    />
  );
};

const DeleteAccountDialog = (props: { hideDialog: HideDialog }) => {
  const { hideDialog } = props;

  const { onDeleteUser } = useDeleteUser({
    onSuccess: () => {
      notifyWarning('Sent account deletion verification email');
    },
  });

  const { notifyWarning } = useNotifications();

  return (
    <ConfirmDeleteDialog
      Header="Delete Account"
      hideDialog={hideDialog}
      onConfirm={async () => {
        await onDeleteUser({});
      }}
      submitText="Send Email"
    >
      <div className="grid gap-5">
        <p className="">
          This will{' '}
          <strong className="text-lg text-theme-t-alert">PERMANENTLY</strong>{' '}
          delete your account and all your collections!
        </p>
        <p>
          If you're sure, we will send you a verification email that will allow
          you to delete your account.
        </p>
      </div>
    </ConfirmDeleteDialog>
  );
};
