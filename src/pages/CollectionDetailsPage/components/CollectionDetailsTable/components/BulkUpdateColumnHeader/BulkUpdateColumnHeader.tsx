import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

import { Button } from '#/components/Button';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { Popover } from '#/components/Popover';

import type { BulkUpdateColumnHeaderPropsDef } from './BulkUpdateColumnHeader.types';

import { useEditingCollectionItemsRowIds } from '../../../../hooks/use-editing-collection-items-row-ids';
import { BulkUpdateDialog } from './components/BulkUpdateDialog';

export const BulkUpdateColumnHeader = (
  props: BulkUpdateColumnHeaderPropsDef,
) => {
  const { customField, form } = props;

  const { editingRowIds } = useEditingCollectionItemsRowIds();

  const [showBulkUpdateDialog, hideBulkUpdateDialog] = useDialog(() => {
    return (
      <BulkUpdateDialog
        customField={customField}
        form={form}
        hideDialog={hideBulkUpdateDialog}
      />
    );
  }, []);

  return (
    <div
      className="flex gap-2 items-center"
      data-custom-field-id={customField.id}
    >
      {customField.name}

      {editingRowIds.length > 1 && (
        <Popover
          Description="Bulk Update"
          isTriggerButton
          Trigger={() => {
            return (
              <Button
                Icon={() => {
                  return (
                    <DynamicFeedIcon
                      className="cursor-pointer"
                      fontSize="inherit"
                    />
                  );
                }}
                onClick={showBulkUpdateDialog}
                size="sm"
                variant="secondary"
              />
            );
          }}
        />
      )}
    </div>
  );
};
