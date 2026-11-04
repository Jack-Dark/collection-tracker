import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
import type { CustomFieldValueBooleanDef } from '#/api/routes/custom-field-values/custom-field-values.types';

import { useCreateCustomFieldValues } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.react-query';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { useLastAddedCustomFieldValues } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.form';

type CustomFieldValueCheckboxPropsDef = {
  autoFocus?: boolean;
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  fieldValue: CustomFieldValueBooleanDef | undefined;
  handleChange: (value: CustomFieldValueBooleanDef | undefined) => void;
  Label?: string | React.JSXElementConstructor<{}>;
};

export const getCustomFieldValueCheckboxAriaLabel = (props: {
  checked: boolean;
  customFieldName: string;
}) => {
  const { checked, customFieldName } = props;

  return `${checked ? 'Uncheck' : 'Check'} ${customFieldName} for row` as const;
};

export const CustomFieldValueCheckbox = ({
  autoFocus,
  customField,
  fieldValue,
  handleChange,
  Label,
}: CustomFieldValueCheckboxPropsDef) => {
  const { onCreateCustomFieldValues, processing } =
    useCreateCustomFieldValues<CustomFieldValueBooleanDef[]>();

  const { updateLastAddedCustomFieldValues } = useLastAddedCustomFieldValues();

  const checked = !!fieldValue?.valueBoolean;

  const ariaLabel = getCustomFieldValueCheckboxAriaLabel({
    checked,
    customFieldName: customField.name,
  });

  const updateField: typeof handleChange = (value) => {
    updateLastAddedCustomFieldValues({
      [customField.id]: value,
    });

    handleChange(value);
  };

  return (
    <CheckboxField
      aria-label={ariaLabel}
      autoFocus={autoFocus}
      checked={checked}
      disabled={processing}
      Label={Label}
      onCheckedChange={async (value) => {
        const prevValue = fieldValue;

        const tempCustomFieldValue: CustomFieldValueBooleanDef = {
          id: uuidv4() as unknown as number,
          valueBoolean: value,
          valueNumber: null,
          valueText: null,
        };

        // ? set temp custom field value for instant UI feedback
        updateField(tempCustomFieldValue);

        onCreateCustomFieldValues(
          {
            records: [{ customFieldId: customField.id, value }],
          },
          {
            onError: () => {
              updateField(prevValue);
            },
            onSuccess: ([newCustomFieldValue]) => {
              updateField(newCustomFieldValue);
            },
          },
        );
      }}
    />
  );
};
