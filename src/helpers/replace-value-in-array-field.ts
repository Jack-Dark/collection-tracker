import type { AnyFieldApi } from '@tanstack/react-form';

import type { CustomFieldFormSchemaDef } from '#/api/routes/custom-fields/custom-fields.types';

// ? This function was created to replace the now missing arrayField.replaceValue helper function during the initial release of the form v2 alpha
export const replaceValueInArrayField = <TArrayField extends AnyFieldApi>(
  field: TArrayField,
  index: number,
  data: CustomFieldFormSchemaDef,
) => {
  field.handleChange(field.value.toSpliced(index, 1, data));
};
