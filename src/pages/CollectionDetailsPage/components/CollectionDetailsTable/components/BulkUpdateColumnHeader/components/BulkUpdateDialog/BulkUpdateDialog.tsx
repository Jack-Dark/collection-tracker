import { useState } from 'react';

import type {
  CustomFieldValueDef,
  CustomFieldValueBooleanDef,
  CustomFieldValueNumberDef,
  CustomFieldValueStringDef,
} from '#/api/routes/custom-field-values/custom-field-values.types';

import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { pluralize } from '#/helpers/pluralize';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

import type { BulkUpdateDialogPropsDef } from './BulkUpdateDialog.types';

import { CustomFieldValueCheckbox } from '../../../column-cells/CollectionDetailsCustomFieldCell/components/CustomFieldValueCheckbox';
import { CustomFieldValueCombobox } from '../../../column-cells/CollectionDetailsCustomFieldCell/components/CustomFieldValueCombobox';
import { CustomFieldValueNumberInput } from '../../../column-cells/CollectionDetailsCustomFieldCell/components/CustomFieldValueNumberInput';

export const BulkUpdateDialog = (props: BulkUpdateDialogPropsDef) => {
  const { customField, form, hideDialog } = props;

  const [fieldValue, setFieldValue] = useState<
    CustomFieldValueDef | undefined
  >();

  const { editingRowIds, getIsEditingRowId } =
    useEditingCollectionItemsRowIds();

  const label = `Update ${customField.name} for ${editingRowIds.length} ${pluralize('item', editingRowIds.length)}`;

  return (
    <Dialog
      Footer={() => {
        return (
          <>
            <Button onClick={hideDialog} text="Cancel" variant="mono" />
            <Button onClick={hideDialog} text="Save" />
          </>
        );
      }}
      Header="Bulk Update"
      onClose={hideDialog}
    >
      <form.Field name="collectionItems">
        {(field) => {
          const handleBulkUpdate = <
            TCustomFieldValue extends CustomFieldValueDef,
          >(
            customFieldValue: TCustomFieldValue | undefined,
          ) => {
            setFieldValue(customFieldValue);

            const valuesWithCustomFieldChange = field.value.map((row) => {
              const isEditing = getIsEditingRowId(String(row.id));

              return isEditing
                ? {
                    ...row,
                    customFieldValues: {
                      ...row.customFieldValues,
                      [customField.id]: customFieldValue,
                    },
                  }
                : row;
            });

            field.handleChange(valuesWithCustomFieldChange);
          };

          return (
            <>
              {customField.type === 'boolean' && (
                <CustomFieldValueCheckbox
                  autoFocus
                  customField={customField}
                  fieldValue={
                    fieldValue as CustomFieldValueBooleanDef | undefined
                  }
                  handleChange={handleBulkUpdate}
                  Label={label}
                />
              )}

              {customField.type === 'number' && (
                <CustomFieldValueNumberInput
                  autoFocus
                  customField={customField}
                  fieldValue={
                    fieldValue as CustomFieldValueNumberDef | undefined
                  }
                  handleChange={handleBulkUpdate}
                  Label={label}
                />
              )}

              {customField.type === 'string' && (
                <CustomFieldValueCombobox
                  autoFocus
                  customField={customField}
                  fieldValue={
                    fieldValue as CustomFieldValueStringDef | undefined
                  }
                  handleChange={handleBulkUpdate}
                  Label={label}
                />
              )}
            </>
          );
        }}
      </form.Field>
    </Dialog>
  );
};
