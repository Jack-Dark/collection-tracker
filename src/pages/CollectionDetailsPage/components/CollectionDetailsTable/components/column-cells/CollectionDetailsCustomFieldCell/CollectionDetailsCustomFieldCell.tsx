import CheckIcon from '@mui/icons-material/Check';
import { Suspense } from 'react';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

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
    <Suspense>
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
                  field={field}
                />
              )}

              {customField.type === 'number' && (
                <CustomFieldValueNumberInput
                  customField={customField}
                  field={field}
                />
              )}

              {customField.type === 'string' && (
                <CustomFieldValueCombobox
                  collectionItemId={collectionItemId}
                  customField={customField}
                  field={field}
                />
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
    </Suspense>
  );
};
