import type { Dispatch, SetStateAction } from 'react';

import { useLayoutEffect } from 'react';

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
  /** Provides a manner in which to receive the processing status of the input. */
  setProcessing?: Dispatch<SetStateAction<boolean>>;
};

export const CustomFieldValueNumberInput = ({
  autoFocus,
  customField,
  fieldValue,
  handleChange,
  Label,
  setProcessing,
}: CustomFieldValueNumberInputPropsDef) => {
  const { onCreateCustomFieldValues, processing } =
    useCreateCustomFieldValues<CustomFieldValueNumberDef[]>();

  const { updateLastAddedCustomFieldValues } = useLastAddedCustomFieldValues();

  useLayoutEffect(() => {
    setProcessing?.(processing);
  }, [processing]);

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
      onValueChangeDebounceMs={300}
      placeholder={`Input ${customField.name}...`}
      type="number"
      value={fieldValue?.valueNumber ?? ''}
    />
  );
};
