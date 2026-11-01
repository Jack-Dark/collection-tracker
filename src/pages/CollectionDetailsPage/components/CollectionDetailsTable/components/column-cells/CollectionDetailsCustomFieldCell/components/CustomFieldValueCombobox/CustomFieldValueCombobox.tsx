import type { AnyFieldApi } from '@tanstack/react-form';

import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

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

type CustomFieldValueComboboxPropsDef<TField extends AnyFieldApi> = {
  collectionItemId: number | string;
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  /** The specific custom field value form field where this component renders */
  field: TField;
};

export const CustomFieldValueCombobox = <TField extends AnyFieldApi>({
  collectionItemId,
  customField,
  field,
}: CustomFieldValueComboboxPropsDef<TField>) => {
  const [customFieldValueToDelete, setCustomFieldValueToDelete] = useState<{
    id: number;
    valueBoolean: null;
    valueNumber: null;
    valueText: string;
  }>();

  const { data, isFetching } = useGetCustomFieldValuesByCustomFieldId({
    placeholderData: [],
    requestArgs: {
      id: customField.id,
    },
  });

  const invalidateGetCustomFieldValuesByCustomFieldId =
    useInvalidateGetCustomFieldValuesByCustomFieldId();

  const { onCreateCustomFieldValues, processing } = useCreateCustomFieldValues({
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
        customFieldValueToDelete && (
          <DeleteCustomFieldValueDialog
            collectionItemId={collectionItemId}
            customFieldValueToDelete={customFieldValueToDelete}
            handleFieldChange={field.handleChange}
            onClose={hideCustomFieldValueDialog}
            selectedCustomFieldValueId={field.value?.id}
          />
        )
      );
    }, [customFieldValueToDelete, field.value?.id]);

  return (
    <ComboboxField
      allowCreatable
      ariaLabel={customField.name}
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
      inputValue={field.value?.valueText ?? undefined}
      items={data}
      labelProperty="valueText"
      name={field.name}
      onValueChange={async (selectedItem) => {
        const handleValueChange = (
          customFieldValue:
            | {
                id: number;
                valueBoolean: boolean | null;
                valueNumber: number | null;
                valueText: string | null;
              }
            | undefined,
        ) => {
          updateLastAddedCustomFieldValues({
            [customField.id]: customFieldValue,
          });
          field.handleChange(customFieldValue);
        };

        if (selectedItem) {
          const customFieldValueExistsInDB =
            typeof selectedItem.id === 'number';

          const isAlreadySelected = field.value?.id === selectedItem.id;
          if (isAlreadySelected) {
            // ? deselect item
            handleValueChange(undefined);
          } else if (customFieldValueExistsInDB) {
            // ? use selected item
            const customFieldValue = {
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
          </div>
        );
      }}
      value={
        field.value
          ? {
              id: field.value.id,
              valueBoolean: null,
              valueNumber: null,
              valueText: field.value.valueText || '',
            }
          : undefined
      }
    />
  );
};
