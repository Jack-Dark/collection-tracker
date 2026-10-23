import type { AnyFieldApi } from '@tanstack/react-form';

import { v4 as uuidv4 } from 'uuid';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
import type { CreateCustomFieldValuesResponseDef } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.types';

import { useCreateCustomFieldValues } from '#/api/routes/custom-field-values/create-custom-field-value/create-custom-field-value.react-query';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { useLastAddedCustomFieldValues } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.form';

type CustomFieldValueCheckboxPropsDef<TField extends AnyFieldApi> = {
  customField: {
    id: number;
    name: string;
    type: CustomFieldTypeDef;
  };
  /** The specific custom field value form field where this component renders */
  field: TField;
};

export const getCustomFieldValueCheckboxAriaLabel = (props: {
  checked: boolean;
  customFieldName: string;
}) => {
  const { checked, customFieldName } = props;

  return `${checked ? 'Uncheck' : 'Checked'} ${customFieldName} for row`;
};

export const CustomFieldValueCheckbox = <TField extends AnyFieldApi>({
  customField,
  field,
}: CustomFieldValueCheckboxPropsDef<TField>) => {
  const { onCreateCustomFieldValues, processing } =
    useCreateCustomFieldValues();

  const { updateLastAddedCustomFieldValues } = useLastAddedCustomFieldValues();

  const checked = !!field.value?.valueBoolean;

  const ariaLabel = getCustomFieldValueCheckboxAriaLabel({
    checked,
    customFieldName: customField.name,
  });

  const updateField = (value: CreateCustomFieldValuesResponseDef[number]) => {
    updateLastAddedCustomFieldValues({
      [customField.id]: value,
    });

    field.handleChange(value);
  };

  return (
    <CheckboxField
      aria-label={ariaLabel}
      checked={checked}
      disabled={processing}
      onCheckedChange={async (value) => {
        const prevValue = field.value;

        const tempCustomFieldValue = {
          id: uuidv4() as unknown as number,
          valueBoolean: value,
          valueNumber: null,
          valueText: null,
        } satisfies CreateCustomFieldValuesResponseDef[number];

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
