import { formOptions } from '@tanstack/react-form';
import { createStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { CreateCollectionItemsFormDataSchemaDef } from '#/api/routes/collection-items/create-collection-item/create-collection-item.types';
import type { CustomFieldValuesByFieldId } from '#/api/routes/custom-field-values/custom-field-values.types';

import { Route as CollectionDetailsRoute } from '#/routes/_protected/collections/$id';

import type { CreateOrUpdateCollectionItemFormDataDef } from './CollectionDetailsPage.types';

import { useHandleGetCollectionDetailsById } from './CollectionDetailsPage';
import { createOrUpdateCollectionItemsFormSchema } from './CollectionDetailsPage.schema';
import { useEnableAutoPopulateCustomFieldValues } from './components/CollectionDetailsTable/hooks/use-collection-details-settings-props/hooks/use-enable-auto-populate-custom-field-values';

export const useCreateNewCollectionItem =
  (): (() => CreateCollectionItemsFormDataSchemaDef) => {
    const { id } = CollectionDetailsRoute.useParams();
    const collectionId = Number(id);

    const { enableAutoPopulateCustomFieldValues } =
      useEnableAutoPopulateCustomFieldValues();

    return () => {
      return {
        collectionId,
        customFieldValues: enableAutoPopulateCustomFieldValues
          ? autoPopulateCustomFieldValuesStore.get()
          : {},
        editionDetails: '',
        id: uuidv4(),
        images: [],
        isSpecialEdition: Boolean(),
        name: '',
        notes: '',
      };
    };
  };

const autoPopulateCustomFieldValuesStore =
  createStore<CustomFieldValuesByFieldId>({});

export const useLastAddedCustomFieldValues = () => {
  const { enableAutoPopulateCustomFieldValues } =
    useEnableAutoPopulateCustomFieldValues();

  const updateLastAddedCustomFieldValues = (
    partialCustomFieldValuesByCustomFieldId: CustomFieldValuesByFieldId,
  ) => {
    if (enableAutoPopulateCustomFieldValues) {
      autoPopulateCustomFieldValuesStore.setState((prev) => {
        return { ...prev, ...partialCustomFieldValuesByCustomFieldId };
      });
    }
  };

  const { data, isSuccess } = useHandleGetCollectionDetailsById();

  useEffect(() => {
    if (isSuccess && enableAutoPopulateCustomFieldValues) {
      updateLastAddedCustomFieldValues(data.lastAddedCustomFieldValues);
    }
  }, [data, isSuccess]);

  return {
    enableAutoPopulateCustomFieldValues,
    updateLastAddedCustomFieldValues,
  };
};

export const createOrUpdateCollectionItemsFormDefaultValues: CreateOrUpdateCollectionItemFormDataDef =
  {
    collectionItems: [],
  };

export const createOrUpdateCollectionItemsFormOptions = formOptions({
  defaultValues: createOrUpdateCollectionItemsFormDefaultValues,
  formId: 'collection-items',
  validators: [
    {
      run: createOrUpdateCollectionItemsFormSchema,
      runOnSubmit: true,
      triggers: [],
    },
  ],
});
