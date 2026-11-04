import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import { createColumnHelper } from '@tanstack/react-table';
import _ from 'lodash';
import { useState } from 'react';

import type {
  CustomFieldValueBooleanDef,
  CustomFieldValueDef,
  CustomFieldValueNumberDef,
  CustomFieldValueStringDef,
} from '#/api/routes/custom-field-values/custom-field-values.types';
import type { TableFeaturesDef } from '#/components/Table';

import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { Popover } from '#/components/Popover';
import { pluralize } from '#/helpers/pluralize';

import type { CreateOrUpdateCollectionItemFormRowDataDef } from '../../CollectionDetailsPage.types';
import type { GetCollectionItemsTableColumnsPropsDef } from './CollectionDetailsTable.types';

import { useEditingCollectionItemsRowIds } from '../../hooks/use-editing-collection-items-row-ids';
import { CollectionDetailsActionsCell } from './components/column-cells/CollectionDetailsActionsCell';
import { CollectionDetailsCreatedAtCell } from './components/column-cells/CollectionDetailsCreatedAtCell';
import { CollectionDetailsCustomFieldCell } from './components/column-cells/CollectionDetailsCustomFieldCell';
import { CustomFieldValueCheckbox } from './components/column-cells/CollectionDetailsCustomFieldCell/components/CustomFieldValueCheckbox';
import { CustomFieldValueCombobox } from './components/column-cells/CollectionDetailsCustomFieldCell/components/CustomFieldValueCombobox';
import { CustomFieldValueNumberInput } from './components/column-cells/CollectionDetailsCustomFieldCell/components/CustomFieldValueNumberInput';
import { CollectionDetailsEditionCell } from './components/column-cells/CollectionDetailsEditionCell';
import { CollectionDetailsImagesCell } from './components/column-cells/CollectionDetailsImagesCell';
import { CollectionDetailsNameCell } from './components/column-cells/CollectionDetailsNameCell';
import { CollectionDetailsNotesCell } from './components/column-cells/CollectionDetailsNotesCell';

const columnHelper = createColumnHelper<
  TableFeaturesDef,
  CreateOrUpdateCollectionItemFormRowDataDef
>();

export const getCollectionItemsTableColumns = (
  props: GetCollectionItemsTableColumnsPropsDef,
) => {
  const { customFields, form, onCancel, onEditClick } = props;

  const sortedCustomFields = _.sortBy(customFields, ({ order }) => {
    return order;
  });

  return columnHelper.columns([
    columnHelper.accessor('name', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsNameCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Name',
      size: 250,
    }),
    columnHelper.accessor('images', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsImagesCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Images',
      size: 250,
    }),
    ...sortedCustomFields.map(({ customField }) => {
      return columnHelper.accessor('customFieldValues', {
        cell: ({ row }) => {
          return (
            <CollectionDetailsCustomFieldCell
              customField={customField}
              form={form}
              rowId={row.id}
              rowIndex={row.index}
            />
          );
        },
        header: () => {
          const { editingRowIds, getIsEditingRowId, isEditing } =
            useEditingCollectionItemsRowIds();

          const [showBulkUpdateDialog, hideBulkUpdateDialog] = useDialog(() => {
            const label = `Update ${customField.name} for ${editingRowIds.length} 
                  ${pluralize('item', editingRowIds.length)}`;

            return (
              <Dialog
                Footer={() => {
                  return (
                    <>
                      <Button
                        onClick={hideBulkUpdateDialog}
                        text="Cancel"
                        variant="mono"
                      />
                      <Button onClick={hideBulkUpdateDialog} text="Save" />
                    </>
                  );
                }}
                Header="Bulk Update"
                onClose={hideBulkUpdateDialog}
              >
                <form.Field name="collectionItems">
                  {(field) => {
                    const [fieldValue, setFieldValue] = useState<
                      CustomFieldValueDef | undefined
                    >();
                    const handleBulkUpdate = <
                      TCustomFieldValue extends CustomFieldValueDef,
                    >(
                      customFieldValue: TCustomFieldValue | undefined,
                    ) => {
                      setFieldValue(customFieldValue);

                      const valuesWithCustomFieldChange = field.value.map(
                        (row) => {
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
                        },
                      );

                      field.handleChange(valuesWithCustomFieldChange);
                    };

                    return (
                      <>
                        {customField.type === 'boolean' && (
                          <CustomFieldValueCheckbox
                            autoFocus
                            customField={customField}
                            fieldValue={
                              fieldValue as
                                CustomFieldValueBooleanDef | undefined
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
                              fieldValue as
                                CustomFieldValueNumberDef | undefined
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
                              fieldValue as
                                CustomFieldValueStringDef | undefined
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
          }, []);

          return (
            <div
              className="flex gap-2 items-center"
              data-custom-field-id={customField.id}
            >
              {customField.name}
              {isEditing && (
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
                        size="xs"
                        variant="secondary"
                      />
                    );
                  }}
                />
              )}
            </div>
          );
        },
        id: `custom-field-id-${customField.id}`,
        minSize:
          customField.type === 'boolean'
            ? 100
            : customField.type === 'number'
              ? 100
              : 250,
      });
    }),
    columnHelper.accessor('editionDetails', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsEditionCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Edition',
      size: 200,
    }),
    columnHelper.accessor('notes', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsNotesCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Notes',
      size: 250,
    }),
    columnHelper.accessor('createdAt', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsCreatedAtCell
            form={form}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: 'Added',
    }),
    columnHelper.accessor('id', {
      cell: ({ row }) => {
        return (
          <CollectionDetailsActionsCell
            form={form}
            onCancel={onCancel}
            onEditClick={onEditClick}
            rowId={row.id}
            rowIndex={row.index}
          />
        );
      },
      header: '',
      id: 'actions',
      maxSize: 40,
    }),
  ]);
};
