import type { RouteComponent } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import { useAppHotkeys, useHotkeys } from '@tanstack/react-hotkeys';
import { useBlocker } from '@tanstack/react-router';

import type { CreateCollectionItemsRequestArgsDef } from '#/api/routes/collection-items/create-collection-item/create-collection-item.types';
import type { OnUpdateCollectionItemsArgsDef } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.types';

import { getPaginationMetadataDefaults } from '#/api/pagination/pagination.constants';
import { useCreateCollectionItems } from '#/api/routes/collection-items/create-collection-item/create-collection-item.react-query';
import {
  useGetCollectionDetailsById,
  useInvalidateGetCollectionDetailsById,
} from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useInvalidateGetCollectionItemsWithCustomFieldValue } from '#/api/routes/collection-items/get-collection-items-with-custom-field-value/get-collection-items-with-custom-field-value.react-query';
import { useInvalidateGetFiltersForCollection } from '#/api/routes/collection-items/get-filters-for-collection/get-filters-for-collection.react-query';
import { useUpdateCollectionItems } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.react-query';
import { useDeleteUnusedCustomFieldValues } from '#/api/routes/custom-field-values/delete-unused-custom-field-values/delete-unused-custom-field-values.react-query';
import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { PageWrapper } from '#/components/PageWrapper';
import { Route as CollectionDetailsRoute } from '#/routes/_protected/collections/$id';

import { createOrUpdateCollectionItemsFormOptions } from './CollectionDetailsPage.form';
import { CollectionDetailsTable } from './components/CollectionDetailsTable';
import { useEditingCollectionItemsRowIds } from './hooks/use-editing-collection-items-row-ids';

export const CollectionDetailsPage: RouteComponent = () => {
  const { collectionName, totalRecords } =
    CollectionDetailsRoute.useLoaderData();

  return (
    <PageWrapper title={`${collectionName} (${totalRecords})`} wideOnMobile>
      <CollectionDetailsTable />
    </PageWrapper>
  );
};

export const useCollectionDetailsForm = () => {
  const { id } = CollectionDetailsRoute.useParams();

  const collectionId = Number(id);

  const { onInterceptRequest } = useSpinner();
  const { notifyWarning } = useNotifications();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const invalidateGetCollectionItemsWithCustomFieldValue =
    useInvalidateGetCollectionItemsWithCustomFieldValue();

  const invalidateGetFiltersForCollection =
    useInvalidateGetFiltersForCollection();

  const { onCreateCollectionItem } = useCreateCollectionItems({
    onSuccess: (response) => {
      if (response?.warning) {
        notifyWarning(response.warning);
      }
    },
  });

  const { onUpdateCollectionItems } = useUpdateCollectionItems();

  const { onDeleteUnusedCustomFieldValues } =
    useDeleteUnusedCustomFieldValues();

  const { data, isSuccess } = useHandleGetCollectionDetailsById();

  const { getIsEditingRowId, isEditing, resetEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const form = useForm({
    ...createOrUpdateCollectionItemsFormOptions,
    // ! you should be able to use the async data to update the default values, but doing so causes the page to lock up for a long time after loading. Uncomment to reproduce
    defaultValues: { collectionItems: data.items },
    // defaultValues: { collectionItems: [] },
    onSubmit: async ({ value: { collectionItems } }) => {
      onInterceptRequest(async () => {
        const editedRecords = collectionItems.filter(({ id }) => {
          return getIsEditingRowId(String(id));
        });

        const isNewRecords = editedRecords.some(({ id }) => {
          return typeof id === 'string';
        });

        if (isNewRecords) {
          const newRecords = editedRecords.map((record) => {
            const { id: _id, ...cleanCollectionItem } = record;

            return cleanCollectionItem;
          });

          await onCreateCollectionItem(
            newRecords as CreateCollectionItemsRequestArgsDef[],
          );
        } else {
          await onUpdateCollectionItems(
            editedRecords as OnUpdateCollectionItemsArgsDef[],
          );
        }

        resetEditingRowIds();
        await onDeleteUnusedCustomFieldValues({ collectionId });
        await Promise.all([
          await invalidateGetCollectionDetailsById({ id: collectionId }),
          await invalidateGetCollectionItemsWithCustomFieldValue(),
          await invalidateGetFiltersForCollection({ id: collectionId }),
        ]);
      });
    },
  });

  const resetForm = () => {
    form.setFieldValue('collectionItems', data.items);
  };

  // useLayoutEffect(() => {
  //   if (isSuccess) {
  //     resetForm();
  //   }
  // }, [data, isSuccess]);

  const appHotkeys = useAppHotkeys();

  useHotkeys([
    {
      callback: async () => {
        await form.handleSubmit();
      },
      hotkey: appHotkeys['app.save'],
      options: {
        enabled: isEditing && form.state.isDirty,
      },
    },
  ]);

  useBlocker({
    disabled: !isEditing,
    shouldBlockFn: () => {
      if (isEditing && form.state.isDirty) {
        const shouldLeave = confirm(
          'You will lose any unsaved changes. Are you sure you want to leave?',
        );

        return !shouldLeave;
      } else {
        return false;
      }
    },
  });

  return { form, resetForm };
};

export const useHandleGetCollectionDetailsById = () => {
  const searchQueries = CollectionDetailsRoute.useSearch();
  const routeParams = CollectionDetailsRoute.useParams();
  const collectionId = Number(routeParams.id);

  const context = useGetCollectionDetailsById({
    placeholderData: {
      collection: {
        customFields: [],
      },
      items: [],
      lastAddedCustomFieldValues: {},
      pagination: getPaginationMetadataDefaults(),
    },
    requestArgs: { collectionId, params: searchQueries },
  });

  return context;
};
