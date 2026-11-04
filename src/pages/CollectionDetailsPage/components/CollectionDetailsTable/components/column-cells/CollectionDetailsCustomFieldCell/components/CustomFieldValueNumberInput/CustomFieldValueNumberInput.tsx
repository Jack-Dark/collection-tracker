import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
import type { CustomFieldValueNumberDef } from '#/api/routes/custom-field-values/custom-field-values.types';

import { useCreateCustomFieldValues } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.react-query';
import { InputField } from '#/components/Fields/InputField';
import { useLastAddedCustomFieldValues } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.form';

type CustomFieldValueNumberInputPropsDef = {
  autoFocus?: boolean;
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  fieldValue: CustomFieldValueNumberDef | undefined;
  handleChange: (value: CustomFieldValueNumberDef | undefined) => void;
  Label?: string | React.JSXElementConstructor<{}>;
};

export const CustomFieldValueNumberInput = ({
  autoFocus,
  customField,
  fieldValue,
  handleChange,
  Label,
}: CustomFieldValueNumberInputPropsDef) => {
  const { onCreateCustomFieldValues, processing } =
    useCreateCustomFieldValues<CustomFieldValueNumberDef[]>();

  const { updateLastAddedCustomFieldValues } = useLastAddedCustomFieldValues();

  return (
    <InputField
      autoFocus={autoFocus}
      disabled={processing}
      Label={Label}
      onValueChange={async (value) => {
        if (value) {
          const formattedValue = Number(value);
          const [newCustomFieldValue] = await onCreateCustomFieldValues({
            records: [
              {
                customFieldId: customField.id,
                value: formattedValue,
              },
            ],
          });
          updateLastAddedCustomFieldValues({
            [customField.id]: newCustomFieldValue,
          });
          handleChange(newCustomFieldValue);
        } else {
          updateLastAddedCustomFieldValues({
            [customField.id]: undefined,
          });
          handleChange(undefined);
        }
      }}
      onValueChangeDebounceMs={500}
      placeholder={`Input ${customField.name}...`}
      type="number"
      value={fieldValue?.valueNumber ?? ''}
    />
  );
};
