import type { CreateOrUpdateCollectionFormTypeDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { TextAreaField } from '#/components/Fields/TextAreaField';
import { EmptyCellValue } from '#/components/Table/components/EmptyCellValue';
import { useEditingCollectionsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

export const CollectionsListNotesCell = (props: {
  form: CreateOrUpdateCollectionFormTypeDef;
  rowId: string;
  rowIndex: number;
}) => {
  const { form, rowId, rowIndex } = props;

  const { getIsEditingRowId } = useEditingCollectionsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  return (
    <form.Field name={`records[${rowIndex}].notes`}>
      {(field) => {
        return isEditingRow ? (
          <TextAreaField
            error={field.errors}
            name={field.name}
            onValueChange={(value) => {
              field.handleChange(value);
            }}
            placeholder="Input notes..."
            value={field.value}
          />
        ) : field.value ? (
          <p>{field.value}</p>
        ) : (
          <EmptyCellValue />
        );
      }}
    </form.Field>
  );
};
