import CheckIcon from '@mui/icons-material/Check';
import { Suspense } from 'react';

import type { CustomFieldTypeDef } from '#/api/db/db-tables-schema.types';
import type {
  CustomFieldValueBooleanDef,
  CustomFieldValueNumberDef,
  CustomFieldValueStringDef,
} from '#/api/routes/custom-field-values/custom-field-values.types';

import { EmptyCellValue } from '#/components/Table/components/EmptyCellValue';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '../../../../../CollectionDetailsPage.types';

import { CustomFieldValueCheckbox } from './components/CustomFieldValueCheckbox';
import { CustomFieldValueCombobox } from './components/CustomFieldValueCombobox';
import { CustomFieldValueNumberInput } from './components/CustomFieldValueNumberInput';

type CollectionDetailsCustomFieldCellPropsDef = {
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
};

export const CollectionDetailsCustomFieldCell = (
  props: CollectionDetailsCustomFieldCellPropsDef,
) => {
  const { customField, form, rowId, rowIndex } = props;

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);

  const collectionItemIdNumber = Number(rowId);
  const collectionItemId = Number.isNaN(collectionItemIdNumber)
    ? rowId
    : collectionItemIdNumber;

  return (
    <form.Field
      name={`collectionItems[${rowIndex}].customFieldValues.${customField.id}`}
    >
      {(field) => {
        const checked = !!field.value?.valueBoolean;

        const cellValue = field.value?.valueText ?? field.value?.valueNumber;

        return isEditingRow ? (
          <>
            {customField.type === 'boolean' && (
              <CustomFieldValueCheckbox
                customField={customField}
                fieldValue={
                  field.value as CustomFieldValueBooleanDef | undefined
                }
                handleChange={field.handleChange}
              />
            )}

            {customField.type === 'number' && (
              <CustomFieldValueNumberInput
                customField={customField}
                fieldValue={
                  field.value as CustomFieldValueNumberDef | undefined
                }
                handleChange={field.handleChange}
              />
            )}

            {customField.type === 'string' && (
              <Suspense>
                <CustomFieldValueCombobox
                  collectionItemId={collectionItemId}
                  customField={customField}
                  enableDeletion
                  fieldValue={
                    field.value as CustomFieldValueStringDef | undefined
                  }
                  handleChange={field.handleChange}
                />
              </Suspense>
            )}
          </>
        ) : (
          <>
            {customField.type === 'boolean' && checked ? (
              <CheckIcon
                aria-label={`${customField.name} checked`}
                className="text-theme-t1"
                fontSize="inherit"
              />
            ) : (
              (cellValue ?? <EmptyCellValue />)
            )}
          </>
        );
      }}
    </form.Field>
  );
};
