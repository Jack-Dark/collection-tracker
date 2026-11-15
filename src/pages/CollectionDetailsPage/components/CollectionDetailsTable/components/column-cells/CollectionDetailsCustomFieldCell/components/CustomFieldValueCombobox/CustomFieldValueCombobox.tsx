import type { Dispatch, SetStateAction } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLayoutEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db/db-tables-schema.types';
import type { CustomFieldValueStringDef } from '#/api/routes/custom-field-values/custom-field-values.types';

import { useCreateCustomFieldValues } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.react-query';
import {
  useGetCustomFieldValuesByCustomFieldId,
  useInvalidateGetCustomFieldValuesByCustomFieldId,
} from '#/api/routes/custom-field-values/get-custom-field-values-by-collection-id/get-custom-field-values-by-collection-id.react-query';
import { Button } from '#/components/Button';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { ComboboxField } from '#/components/Fields/ComboboxField';
import { useLastAddedCustomFieldValues } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.form';

import { DeleteCustomFieldValueDialog } from './components/DeleteCustomFieldValueDialog';

type CustomFieldValueComboboxPropsDef = {
  autoFocus?: boolean;
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  fieldValue: CustomFieldValueStringDef | undefined;
  handleChange: (value: CustomFieldValueStringDef | undefined) => void;
  Label?: string | React.JSXElementConstructor<{}>;
  /** Provides a manner in which to receive the processing status of the input. */
  setProcessing?: Dispatch<SetStateAction<boolean>>;
} & (
  | {
      collectionItemId: number | string;
      enableDeletion: boolean;
    }
  | {
      collectionItemId?: never;
      enableDeletion?: never;
    }
);

export const CustomFieldValueCombobox = ({
  autoFocus,
  collectionItemId,
  customField,
  enableDeletion,
  fieldValue,
  handleChange,
  Label,
  setProcessing,
}: CustomFieldValueComboboxPropsDef) => {
  const [customFieldValueToDelete, setCustomFieldValueToDelete] = useState<
    CustomFieldValueStringDef | undefined
  >();

  const { data, isFetching } = useGetCustomFieldValuesByCustomFieldId({
    placeholderData: [],
    requestArgs: {
      id: customField.id,
    },
  });

  const invalidateGetCustomFieldValuesByCustomFieldId =
    useInvalidateGetCustomFieldValuesByCustomFieldId();

  const { onCreateCustomFieldValues, processing } = useCreateCustomFieldValues<
    CustomFieldValueStringDef[]
  >({
    onSuccess: async () => {
      await invalidateGetCustomFieldValuesByCustomFieldId({
        id: customField.id,
      });
    },
  });

  const { updateLastAddedCustomFieldValues } = useLastAddedCustomFieldValues();

  const [showDeleteCustomFieldValueDialog, hideCustomFieldValueDialog] =
    useDialog(() => {
      return (
        customFieldValueToDelete &&
        enableDeletion && (
          <DeleteCustomFieldValueDialog
            collectionItemId={collectionItemId}
            customFieldValueToDelete={customFieldValueToDelete}
            handleFieldChange={handleChange}
            onClose={hideCustomFieldValueDialog}
            selectedCustomFieldValueId={fieldValue?.id}
          />
        )
      );
    }, [customFieldValueToDelete, fieldValue?.id]);

  useLayoutEffect(() => {
    setProcessing?.(processing);
  }, [processing]);

  return (
    <ComboboxField
      allowCreatable
      ariaLabel={customField.name}
      autoFocus={autoFocus}
      caseSensitiveCreation
      createNewItem={(label) => {
        return {
          // ? typing as number to resolve inferred type errors
          id: uuidv4() as unknown as number,
          valueBoolean: null,
          valueNumber: null,
          valueText: label,
        };
      }}
      disabled={isFetching || processing}
      idProperty="id"
      inputValue={fieldValue?.valueText ?? undefined}
      items={data}
      Label={Label}
      labelProperty="valueText"
      onValueChange={async (selectedItem) => {
        const handleValueChange: typeof handleChange = (customFieldValue) => {
          updateLastAddedCustomFieldValues({
            [customField.id]: customFieldValue,
          });
          handleChange(customFieldValue);
        };

        if (selectedItem) {
          const customFieldValueExistsInDB =
            typeof selectedItem.id === 'number';

          const isAlreadySelected = fieldValue?.id === selectedItem.id;
          if (isAlreadySelected) {
            // ? deselect item
            handleValueChange(undefined);
          } else if (customFieldValueExistsInDB) {
            // ? use selected item
            const customFieldValue: CustomFieldValueStringDef = {
              id: selectedItem.id,
              valueBoolean: null,
              valueNumber: null,
              valueText: selectedItem.valueText,
            };
            handleValueChange(customFieldValue);
          } else {
            // ? create selected item in DB
            const [newCustomFieldValue] = await onCreateCustomFieldValues({
              records: [
                {
                  customFieldId: customField.id,
                  value: selectedItem.valueText,
                },
              ],
            });

            handleValueChange(newCustomFieldValue);
          }
        }
      }}
      placeholder={`Input ${customField.name}...`}
      RenderItem={({ item, SelectedIndicator }) => {
        return (
          <div className="flex gap-2 items-center w-full">
            <span>{item.valueText}</span>
            <SelectedIndicator>
              <CheckIcon fontSize="inherit" />
            </SelectedIndicator>

            {enableDeletion && (
              <Button
                aria-label="Delete"
                className="text-gray-600 hover:text-red-700 cursor-pointer ml-auto px-2 py-1"
                Icon={() => {
                  return <DeleteIcon fontSize="inherit" />;
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setCustomFieldValueToDelete(item);
                  showDeleteCustomFieldValueDialog();
                }}
                size="custom"
                variant="ghost"
              />
            )}
          </div>
        );
      }}
      value={
        fieldValue
          ? {
              id: fieldValue.id,
              valueBoolean: null,
              valueNumber: null,
              valueText: fieldValue.valueText || '',
            }
          : undefined
      }
    />
  );
};
