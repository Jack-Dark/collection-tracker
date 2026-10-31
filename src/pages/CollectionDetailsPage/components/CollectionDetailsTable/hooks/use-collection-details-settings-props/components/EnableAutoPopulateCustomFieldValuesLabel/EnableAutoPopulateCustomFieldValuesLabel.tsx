import { useEnableAutoPopulateCustomFieldValues } from '../../hooks/use-enable-auto-populate-custom-field-values';
import { FormatLabelWithStatusIcon } from '../../use-collection-details-settings-props';

export const EnableAutoPopulateCustomFieldValuesLabel = () => {
  const { enableAutoPopulateCustomFieldValues } =
    useEnableAutoPopulateCustomFieldValues();

  return (
    <FormatLabelWithStatusIcon active={enableAutoPopulateCustomFieldValues}>
      <p>
        Auto-populate new items with the last entered custom field values for
        this collection.
      </p>
    </FormatLabelWithStatusIcon>
  );
};
