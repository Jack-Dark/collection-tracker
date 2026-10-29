import type { PropsWithChildren } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { createAtom, useAtom } from '@tanstack/react-store';
import { useLayoutEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
import type { CustomFieldDataForCollectionDef } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.types';
import type { CustomFieldFormSchemaDef } from '#/api/routes/custom-fields/custom-fields.types';
import type { HideDialog } from '#/components/Dialog/hooks/useDialog';
import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { useGetNumCollectionsWithCustomField } from '#/api/routes/collections/get-num-collections-with-custom-field/get-num-collections-with-custom-field.react-query';
import { useCreateCustomFields } from '#/api/routes/custom-fields/create-custom-fields/create-custom-fields.react-query';
import { customFieldFormSchema } from '#/api/routes/custom-fields/custom-fields.schema';
import { useDeleteCustomFields } from '#/api/routes/custom-fields/delete-custom-fields/delete-custom-fields.react-query';
import {
  useGetCustomFields,
  useInvalidateGetCustomFields,
} from '#/api/routes/custom-fields/get-custom-fields/get-custom-fields.react-query';
import { useUpdateCustomFields } from '#/api/routes/custom-fields/update-custom-fields/update-custom-fields.react-query';
import { Button } from '#/components/Button';
import { ConfirmDeleteDialog } from '#/components/ConfirmDeleteDialog';
import { Dialog } from '#/components/Dialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { ComboboxField } from '#/components/Fields/ComboboxField';
import { InputField } from '#/components/Fields/InputField';
import { SelectField } from '#/components/Fields/SelectField';
import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { pluralize } from '#/helpers/pluralize';
import { replaceValueInArrayField } from '#/helpers/replace-value-in-array-field';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const customFieldTypeLabelsMap = {
  boolean: 'Checkbox',
  number: 'Number',
  string: 'Text',
} as const;

const fieldDataTypeItems = [
  {
    id: null as unknown as CustomFieldTypeDef,
    label: 'Select data type...',
  },
  ...(['number', 'string', 'boolean'] as const).map((type) => {
    return {
      id: type,
      label: customFieldTypeLabelsMap[type],
    };
  }),
] satisfies {
  id: CustomFieldTypeDef;
  label: string;
}[];

const getFieldItemLabel = (type: CustomFieldTypeDef) => {
  return (
    fieldDataTypeItems.find((fieldItem) => {
      return fieldItem.id === type;
    })?.label || '-'
  );
};

export const CollectionsListCustomFieldsCell = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  index: number;
  rowId: string;
}) => {
  const { form, index: rowIndex, rowId } = props;

  const { getIsEditingRowId } = useEditingCollectionsRowIds();

  const isEditingRow = getIsEditingRowId(rowId);

  // const editCustomFieldAtom = useEditCustomFieldAtom();

  const lastEditedCustomField = useLastEditedCustomField();

  const [updateItemsTimestamp, setUpdateItemsTimestamp] = useState<number>(0);

  const { data: customFieldsInDb, isSuccess } = useGetCustomFields({
    enabled: isEditingRow,
    placeholderData: [],
    requestArgs: {},
  });

  useLayoutEffect(() => {
    if (isSuccess) {
      setUpdateItemsTimestamp(Date.now());
    }
  }, [isSuccess, customFieldsInDb]);

  const [showAddOrEditCustomFieldsDialog, hideAddOrEditCustomFieldsDialog] =
    useDialog(() => {
      return (
        <form.ArrayField name={`records[${rowIndex}].customFields`}>
          {(customFieldFormField) => {
            const { removeValue } = customFieldFormField;

            const replaceValue = (
              index: number,
              value: CustomFieldFormSchemaDef,
            ) => {
              replaceValueInArrayField(customFieldFormField, index, value);
            };

            return (
              <AddOrEditCustomFieldDialog
                form={form}
                onClose={hideAddOrEditCustomFieldsDialog}
                removeValue={removeValue}
                replaceValue={replaceValue}
                rowIndex={rowIndex}
              />
            );
          }}
        </form.ArrayField>
      );
    }, []);

  const [
    showConfirmDeleteCustomFieldDialog,
    hideConfirmDeleteCustomFieldDialog,
  ] = useDialog(() => {
    return (
      <DeleteCustomFieldDialog
        form={form}
        onClose={hideConfirmDeleteCustomFieldDialog}
      />
    );
  }, []);

  return (
    <form.ArrayField name={`records[${rowIndex}].customFields`}>
      {(field) => {
        const comboboxValue = field.value.map(({ customField }) => {
          return {
            ...customField,
            id: customField.id,
          };
        });

        return isEditingRow ? (
          <div className="w-full max-w-80">
            <ComboboxField
              allowCreatable
              ariaLabel="Custom Field"
              caseSensitiveCreation
              createNewItem={(trimmedQuery) => {
                const newRecord: CustomFieldDataForCollectionDef = {
                  id: uuidv4() as unknown as number,
                  name: trimmedQuery,
                  type: null as unknown as CustomFieldTypeDef,
                };

                const index = field.value.length;

                lastEditedCustomField.setIndex(index);
                lastEditedCustomField.setData({
                  customField: newRecord,
                  order: index,
                });

                return newRecord;
              }}
              enableChipSort
              error={field.errors}
              idProperty="name"
              isItemEqualToValue={(item, value) => {
                return item?.id === value?.id;
              }}
              items={customFieldsInDb}
              itemsDependencies={[updateItemsTimestamp]}
              labelProperty="name"
              multiple
              name={field.name}
              onChipSort={(items) => {
                const itemsWithOrder = items.map((item, index) => {
                  return { customField: item, order: index };
                });
                field.handleChange(itemsWithOrder);
              }}
              onRemoveChip={(chip) => {
                const matchingIndex = field.value.findIndex((data) => {
                  return data.customField.id === chip.id;
                });
                field.removeValue(matchingIndex);
              }}
              onValueChange={(customFields) => {
                const lastAddedIndex = customFields.findIndex((customField) => {
                  return (
                    customField.id ===
                    lastEditedCustomField.data?.customField.id
                  );
                });

                if (lastAddedIndex >= 0) {
                  lastEditedCustomField.setIndex(lastAddedIndex);
                  showAddOrEditCustomFieldsDialog();
                } else {
                  lastEditedCustomField.setIndex(undefined);
                }

                form.setFieldValue(
                  field.name,
                  customFields.map((customField, index) => {
                    return {
                      customField,
                      order: index,
                    };
                  }),
                );
              }}
              placeholder="Input custom fields..."
              RenderChip={({ item }) => {
                return (
                  <div className="flex gap-3">
                    <RenderCustomField item={item}>
                      <Button
                        aria-label="Edit"
                        className="text-theme-t2 hover:text-theme-link-hover cursor-pointer ml-auto p-0.5"
                        Icon={() => {
                          return <EditIcon fontSize="inherit" />;
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          const indexToEdit = field.value.findIndex(
                            ({ customField }) => {
                              return customField.id === item.id;
                            },
                          );
                          if (indexToEdit >= 0) {
                            lastEditedCustomField.setIndex(indexToEdit);
                            lastEditedCustomField.setData({
                              customField: item,
                              order: indexToEdit,
                            });

                            showAddOrEditCustomFieldsDialog();
                          }
                        }}
                        size="custom"
                        variant="ghost"
                      />
                    </RenderCustomField>
                  </div>
                );
              }}
              RenderItem={({ item, multiple, SelectedIndicator }) => {
                return (
                  <div className="flex gap-2 items-center w-full">
                    <RenderCustomField item={item} />
                    {multiple && (
                      <SelectedIndicator>
                        <CheckIcon fontSize="inherit" />
                      </SelectedIndicator>
                    )}

                    <Button
                      aria-label="Delete"
                      className="text-theme-t2 hover:text-theme-t-alert-hover cursor-pointer ml-auto px-2 py-1"
                      Icon={() => {
                        return <DeleteIcon fontSize="inherit" />;
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (typeof item.id === 'string') {
                          lastEditedCustomField.setIndex(undefined);
                          lastEditedCustomField.setData(undefined);

                          setUpdateItemsTimestamp(Date.now());
                        } else {
                          const itemIndex = field.value.findIndex(
                            ({ customField }) => {
                              return customField.id === item.id;
                            },
                          );

                          lastEditedCustomField.setIndex(itemIndex);
                          lastEditedCustomField.setData({
                            customField: item,
                            order: itemIndex,
                          });
                          showConfirmDeleteCustomFieldDialog();
                        }
                      }}
                      size="custom"
                      variant="ghost"
                    />
                  </div>
                );
              }}
              value={comboboxValue}
              verifyShowNewItem={({ itemMatchingQuery, newItem }) => {
                return newItem.type !== itemMatchingQuery?.type;
              }}
            />
          </div>
        ) : field.value.length ? (
          field.value.map(({ customField }) => {
            return (
              <span
                className="group/controls flex items-center gap-2 flex-wrap"
                key={customField.id}
              >
                <RenderCustomField item={customField} />
              </span>
            );
          })
        ) : (
          '-'
        );
      }}
    </form.ArrayField>
  );
};

export const DeleteCustomFieldDialog = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  onClose: HideDialog;
}) => {
  const { form, onClose } = props;

  const lastEditedCustomField = useLastEditedCustomField();

  const id = Number(lastEditedCustomField.data?.customField.id);

  const { data } = useGetNumCollectionsWithCustomField({
    placeholderData: {
      numAffectedCollections: 0,
    },
    requestArgs: {
      customFieldId: id,
    },
  });

  const { numAffectedCollections } = data;

  const invalidateGetCustomFields = useInvalidateGetCustomFields();

  const { onDeleteCustomFields } = useDeleteCustomFields();

  return (
    <form.Field name="records">
      {(field) => {
        const handleDelete = async () => {
          await onDeleteCustomFields({ ids: [id] });
          await invalidateGetCustomFields();

          const cleanedRecords = field.value.map((record) => {
            const filteredCustomFields = record.customFields.filter(
              ({ customField }) => {
                return customField.id !== id;
              },
            );

            return { ...record, customFields: filteredCustomFields };
          });
          field.handleChange(cleanedRecords);

          onClose();
        };

        return (
          <ConfirmDeleteDialog hideDialog={onClose} onConfirm={handleDelete}>
            <div className="grid gap-4">
              <p className="text-center">
                Are you sure you want to delete this field?
              </p>

              <h4 className="text-center">
                {lastEditedCustomField.data?.customField.name}{' '}
                <span className="text-theme-t2 text-[.7em]">
                  (
                  {lastEditedCustomField.data?.customField.type
                    ? customFieldTypeLabelsMap[
                        lastEditedCustomField.data.customField.type
                      ]
                    : '-'}
                  )
                </span>
              </h4>

              {!!numAffectedCollections && (
                <div className="grid gap-1">
                  <p className="text-center text-sm text-theme-t1">
                    This will remove the field from {numAffectedCollections}{' '}
                    {pluralize('collection', numAffectedCollections)} and "
                    {lastEditedCustomField.data?.customField.name}" details from
                    all items within.
                  </p>
                </div>
              )}

              <p className="max-w-100 text-theme-t2 text-sm text-center">
                Note: This will delete both the field and values, even if
                changes to your collection are dismissed.
              </p>
            </div>
          </ConfirmDeleteDialog>
        );
      }}
    </form.Field>
  );
};

export const AddOrEditCustomFieldDialog = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  onClose: () => void;
  removeValue: (index: number) => void;
  replaceValue: (index: number, customField: CustomFieldFormSchemaDef) => void;
  rowIndex: number;
}) => {
  const { form, onClose, removeValue, replaceValue, rowIndex } = props;

  const [fieldTypeError, setFieldTypeError] = useState<string | undefined>();

  const lastEditedCustomField = useLastEditedCustomField();

  const { onInterceptProcessingRequest, processing } = useSpinner();
  const { onCreateCustomFields } = useCreateCustomFields();
  const { onUpdateCustomFields } = useUpdateCustomFields();

  const invalidateGetCustomFields = useInvalidateGetCustomFields();

  const isNewRecord =
    typeof lastEditedCustomField.data?.customField.id === 'string';

  const { data: customFieldsInDb = [] } = useGetCustomFields({
    placeholderData: [],
    requestArgs: {},
  });

  const customFieldDataTypeItems = useMemo(() => {
    const customFieldsInDbWithSameName = customFieldsInDb.filter(
      ({ id, name }) => {
        return (
          name === lastEditedCustomField.data?.customField.name &&
          id !== lastEditedCustomField.data?.customField.id
        );
      },
    );

    let fieldTypeError: string | undefined;

    const typeItemsWithDisabledStates = fieldDataTypeItems.map(
      (fieldDataTypeItem) => {
        const isPlaceholderItem = !fieldDataTypeItem.id;

        if (isPlaceholderItem) {
          return { ...fieldDataTypeItem, disabled: true };
        }

        const disabled = customFieldsInDbWithSameName.some(({ type }) => {
          return type === fieldDataTypeItem.id;
        });

        if (disabled) {
          fieldTypeError = 'Matches existing custom field';
        }

        return { ...fieldDataTypeItem, disabled };
      },
    );

    setFieldTypeError(fieldTypeError);

    return typeItemsWithDisabledStates;
  }, [
    lastEditedCustomField.data?.customField.name,
    lastEditedCustomField.data?.customField.type,
  ]);

  return lastEditedCustomField.index === undefined ? null : (
    <form.Field
      name={`records[${rowIndex}].customFields[${lastEditedCustomField.index}]`}
    >
      {(customFieldField) => {
        const onCancel = () => {
          if (
            lastEditedCustomField.index !== undefined &&
            lastEditedCustomField.data
          ) {
            onClose();

            if (isNewRecord) {
              removeValue(lastEditedCustomField.index);
            } else {
              replaceValue(
                lastEditedCustomField.index,
                lastEditedCustomField.data,
              );
            }
          }
        };

        const onSave = async () => {
          await onInterceptProcessingRequest(async () => {
            if (lastEditedCustomField.index !== undefined) {
              const { customField, order } = customFieldField.value;
              const { id, name, type } = customField;

              if (typeof id === 'string') {
                const [newRecord] = await onCreateCustomFields({
                  records: [{ name, type }],
                });

                replaceValue(lastEditedCustomField.index, {
                  customField: {
                    id: newRecord.id,
                    name: newRecord.name,
                    type: newRecord.type,
                  },
                  order,
                });
              } else {
                await onUpdateCustomFields({
                  records: [{ id, name, type }],
                });
              }

              await invalidateGetCustomFields();
              onClose();
            }
          });
        };

        const isValid =
          !fieldTypeError &&
          customFieldFormSchema.validate(customFieldField.value);

        return lastEditedCustomField.index === undefined ? null : (
          <Dialog
            disableOnClose={processing}
            Footer={() => {
              return (
                <>
                  <Button
                    disabled={processing}
                    onClick={onCancel}
                    text="Cancel"
                    variant="mono"
                  />
                  <Button
                    disabled={!isValid}
                    onClick={onSave}
                    processing={processing}
                    text="Save"
                  />
                </>
              );
            }}
            Header={`${isNewRecord ? 'Create' : 'Edit'} Custom Field`}
            onClose={onCancel}
          >
            <div className="grid gap-4">
              <form.Field
                name={`records[${rowIndex}].customFields[${lastEditedCustomField.index}].customField.name`}
              >
                {(nameField) => {
                  return (
                    <InputField
                      autoFocus
                      error={nameField.errors}
                      Label="Field Name"
                      name={nameField.name}
                      onValueChange={(value) => {
                        nameField.handleChange(value);
                      }}
                      placeholder="Input column name..."
                      value={nameField.value}
                    />
                  );
                }}
              </form.Field>

              <form.Field
                name={`records[${rowIndex}].customFields[${lastEditedCustomField.index}].customField.type`}
              >
                {(typeField) => {
                  const formattedValue:
                    (typeof customFieldDataTypeItems)[number] | undefined =
                    typeField.value
                      ? {
                          disabled: false,
                          id: typeField.value,
                          label: customFieldTypeLabelsMap[typeField.value],
                        }
                      : undefined;

                  return (
                    <SelectField
                      error={fieldTypeError || typeField.errors}
                      items={customFieldDataTypeItems}
                      Label="Input Type"
                      name={typeField.name}
                      onValueChange={(value) => {
                        const type = value?.id;
                        if (type) {
                          typeField.handleChange(type);
                        }
                      }}
                      placeholder="Select data type..."
                      value={formattedValue}
                    />
                  );
                }}
              </form.Field>

              <p className="max-w-100 text-theme-t2 text-sm text-center">
                Note: This will {isNewRecord ? 'create the' : 'update your'}{' '}
                custom field, even if changes to your collection are dismissed.
              </p>
            </div>
          </Dialog>
        );
      }}
    </form.Field>
  );
};

const RenderCustomField = (
  props: PropsWithChildren<{
    item: CustomFieldDataForCollectionDef<string | number>;
  }>,
) => {
  const { children, item } = props;

  const { id, name, type } = item;

  return (
    <>
      <span className="whitespace-nowrap" key={id}>
        <span>{name}</span>{' '}
        <span
          className={`${type ? 'text-theme-t2' : 'text-theme-t-alert'} text-xs leading-none`}
        >
          ({getFieldItemLabel(type)})
        </span>
      </span>
      {children}
    </>
  );
};

const lastEditedCustomFieldIndex = createAtom<number | undefined>(undefined);
const lastEditedCustomFieldData = createAtom<
  CustomFieldFormSchemaDef | undefined
>(undefined);

const useLastEditedCustomField = () => {
  const [index, setIndex] = useAtom(lastEditedCustomFieldIndex);
  const [data, setData] = useAtom(lastEditedCustomFieldData);

  return {
    data,
    index,
    setData,
    setIndex,
  };
};
