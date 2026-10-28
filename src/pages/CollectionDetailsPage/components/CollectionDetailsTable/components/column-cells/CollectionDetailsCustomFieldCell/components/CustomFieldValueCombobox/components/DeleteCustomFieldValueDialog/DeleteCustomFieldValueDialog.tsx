import type { AnyFieldApi } from '@tanstack/react-form';

import { useLayoutEffect } from 'react';

import type { HideDialog } from '#/components/Dialog/hooks/useDialog';

import { useGetCollectionItemsWithCustomFieldValue } from '#/api/routes/collection-items/get-collection-items-with-custom-field-value/get-collection-items-with-custom-field-value.react-query';
import { useDeleteCustomFieldValues } from '#/api/routes/custom-field-values/delete-custom-field-values/delete-custom-field-values.react-query';
import { useInvalidateGetCustomFieldValuesByCustomFieldId } from '#/api/routes/custom-field-values/get-custom-field-values-by-collection-id/get-custom-field-values-by-collection-id.react-query';
import { ConfirmDeleteDialog } from '#/components/ConfirmDeleteDialog';
import { pluralize } from '#/helpers/pluralize';

type DeleteCustomFieldValueDialogPropsDef<
  THandleFieldChange extends AnyFieldApi['handleChange'],
> = {
  collectionItemId: number | string;
  customFieldValueToDelete: {
    id: number;
    valueText: string;
  };
  handleFieldChange: THandleFieldChange;
  onClose: HideDialog;
  selectedCustomFieldValueId: number | undefined;
};

export const DeleteCustomFieldValueDialog = <
  THandleFieldChange extends AnyFieldApi['handleChange'],
>(
  props: DeleteCustomFieldValueDialogPropsDef<THandleFieldChange>,
) => {
  const {
    collectionItemId,
    customFieldValueToDelete,
    handleFieldChange,
    onClose,
    selectedCustomFieldValueId,
  } = props;

  const id = Number(customFieldValueToDelete.id);

  const getShouldAutoDelete = (props: {
    affectedCollections: {
      id: number;
      name: string;
    }[];
    numAffectedCollectionItems: number;
  }) => {
    const { affectedCollections, numAffectedCollectionItems } = props;

    return affectedCollections.length <= 1 && numAffectedCollectionItems <= 1;
  };

  const { data, isSuccess } = useGetCollectionItemsWithCustomFieldValue({
    placeholderData: (_data) => {
      return {
        affectedCollections: [],
        numAffectedCollectionItems: 0,
      } satisfies typeof _data;
    },
    requestArgs: {
      customFieldValueId: id,
    },
  });

  const { affectedCollections, numAffectedCollectionItems } = data;

  const invalidateGetCustomFieldValuesByCustomFieldId =
    useInvalidateGetCustomFieldValuesByCustomFieldId();

  const { onDeleteCustomFieldValues } = useDeleteCustomFieldValues({
    onSuccess: async () => {
      await invalidateGetCustomFieldValuesByCustomFieldId();

      if (selectedCustomFieldValueId === id) {
        handleFieldChange(undefined);
      }

      onClose();
    },
    showLoading: true,
  });

  const onDelete = async () => {
    await onDeleteCustomFieldValues({
      collectionItemId,
      ids: [id],
    });
  };

  const shouldAutoDelete = getShouldAutoDelete({
    affectedCollections,
    numAffectedCollectionItems,
  });

  useLayoutEffect(() => {
    if (isSuccess) {
      const shouldAutoDelete = getShouldAutoDelete(data);

      if (shouldAutoDelete) {
        onDelete();
      }
    }
  }, [isSuccess, data]);

  return shouldAutoDelete ? null : (
    <ConfirmDeleteDialog hideDialog={onClose} onConfirm={onDelete}>
      <div className="grid gap-4 content-center h-full">
        <p className="text-center" />

        {!!numAffectedCollectionItems && (
          <>
            <div className="grid gap-1">
              <p className="text-center text-sm text-theme-t1">
                This will remove "{customFieldValueToDelete.valueText}" from{' '}
                <strong className="text-theme-t-alert">
                  {numAffectedCollectionItems}
                </strong>{' '}
                collection {pluralize('item', numAffectedCollectionItems)}{' '}
                {pluralize('in', numAffectedCollectionItems, 'across')} the
                following {pluralize('collection', numAffectedCollectionItems)}:
              </p>

              <div className="flex justify-center">
                <ul className="list-inside list-disc">
                  {affectedCollections.map(({ id, name }) => {
                    return (
                      <li key={id}>
                        <span className="text-sm">{name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <p className="text-center text-sm text-theme-t1">
                Are you sure you want to delete this custom field value?
              </p>
            </div>

            <div className="grid gap-1">
              <p className="max-w-100 text-theme-t2 text-sm text-center">
                Note: This will delete the custom field value, even if changes
                to your collection are dismissed.
              </p>
            </div>
          </>
        )}
      </div>
    </ConfirmDeleteDialog>
  );
};
