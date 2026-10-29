import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { SwitchField } from '#/components/Fields/SwitchField';
import { TextAreaField } from '#/components/Fields/TextAreaField';
import { EmptyCellValue } from '#/components/Table/components/EmptyCellValue';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

export const CollectionDetailsEditionCell = (props: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
}) => {
  const { form, rowId, rowIndex } = props;

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  return (
    <form.ArrayField name="collectionItems">
      {() => {
        return (
          <div className="grid gap-2">
            <form.Field name={`collectionItems[${rowIndex}].isSpecialEdition`}>
              {(isSpecialEditionField) => {
                return (
                  <>
                    {isEditingRow && (
                      <SwitchField
                        checked={isSpecialEditionField.value}
                        error={isSpecialEditionField.errors}
                        Label="Special edition"
                        onCheckedChange={(checked) => {
                          isSpecialEditionField.handleChange(checked);

                          const editionDetails = checked
                            ? "Collector's Edition"
                            : '';
                          form.setFieldValue(
                            `collectionItems[${rowIndex}].editionDetails`,
                            editionDetails,
                          );
                        }}
                      />
                    )}

                    <form.Field
                      name={`collectionItems[${rowIndex}].editionDetails`}
                    >
                      {(editionDetailsField) => {
                        return isEditingRow ? (
                          isSpecialEditionField.value && (
                            <TextAreaField
                              error={editionDetailsField.errors}
                              name={editionDetailsField.name}
                              onValueChange={(value) => {
                                return editionDetailsField.handleChange(value);
                              }}
                              required
                              value={editionDetailsField.value}
                            />
                          )
                        ) : editionDetailsField.value ? (
                          <p>{editionDetailsField.value}</p>
                        ) : (
                          <EmptyCellValue />
                        );
                      }}
                    </form.Field>
                  </>
                );
              }}
            </form.Field>
          </div>
        );
      }}
    </form.ArrayField>
  );
};
