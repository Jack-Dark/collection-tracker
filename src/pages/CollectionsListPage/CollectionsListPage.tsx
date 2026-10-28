import type { RouteComponent } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import { useAppHotkeys, useHotkeys } from '@tanstack/react-hotkeys';
import { useBlocker } from '@tanstack/react-router';
import { useEffect, useLayoutEffect } from 'react';

import type { UpdateCollectionsFormRecordSchemaDef } from '#/api/routes/collections/update-collection-by-id/update-collection-by-id.types';

import { getPaginationMetadataDefaults } from '#/api/pagination/pagination.constants';
import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useCreateCollection } from '#/api/routes/collections/create-collection/create-collection.react-query';
import { useInvalidateGetNavMenuCollections } from '#/api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import {
  useGetPaginatedCollections,
  useInvalidateGetPaginatedCollections,
} from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { useUpdateCollectionById } from '#/api/routes/collections/update-collection-by-id/update-collection-by-id.react-query';
import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { PageWrapper } from '#/components/PageWrapper';
import { Route as CollectionsRoute } from '#/routes/_protected/collections';

import { createOrUpdateCollectionFormOptions } from './CollectionsListPage.form';
import { CollectionsListTable } from './components/CollectionsListTable/CollectionsListTable';
import { useEditingCollectionsRowIds } from './hooks/use-editing-collections-row-ids';

export const CollectionsListPage: RouteComponent = () => {
  const searchQueries = CollectionsRoute.useSearch();

  const { data, isSuccess } = useGetPaginatedCollections({
    placeholderData: {
      collections: [],
      pagination: getPaginationMetadataDefaults(1000),
    },
    requestArgs: { params: searchQueries },
  });

  const { onInterceptRequest } = useSpinner();
  const { notifyWarning } = useNotifications();

  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const { onCreateCollection } = useCreateCollection({
    onSuccess: (response) => {
      if (response?.warning) {
        notifyWarning(response.warning);
      }
    },
  });

  const { onUpdateCollectionById } = useUpdateCollectionById();

  const { getIsEditingRowId, isEditing, resetEditingRowIds } =
    useEditingCollectionsRowIds();

  const form = useForm({
    ...createOrUpdateCollectionFormOptions,
    defaultValues: { records: data.collections },
    onSubmit: async ({ value: { records } }) => {
      await onInterceptRequest(async () => {
        const editedRecords = records.filter(({ id }) => {
          return getIsEditingRowId(String(id));
        });

        const isUpdatedRecords = editedRecords.some(({ createdAt }) => {
          return createdAt;
        });

        if (isUpdatedRecords) {
          await onUpdateCollectionById({
            records: editedRecords as UpdateCollectionsFormRecordSchemaDef[],
          });

          await Promise.all(
            editedRecords.map(({ id }) => {
              return invalidateGetCollectionDetailsById({ id });
            }),
          );
        } else {
          const newRecords = editedRecords.map((record) => {
            const {
              createdAt: _createdAt,
              id: _id,
              updatedAt: _updatedAt,
              ...newCollectionData
            } = record;

            return newCollectionData;
          });
          await onCreateCollection({ records: newRecords });
        }

        resetEditingRowIds();

        await invalidateGetNavMenuCollections();
        await invalidateGetPaginatedCollections();

        form.reset();
      });
    },
  });

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

  useEffect(() => {
    return () => {
      resetEditingRowIds();
    };
  }, []);

  useLayoutEffect(() => {
    if (isSuccess) {
      form.reset();
    }
  }, [isSuccess, data]);

  return (
    <PageWrapper
      title={`Collections (${data.pagination.totalRecords})`}
      wideOnMobile
    >
      <CollectionsListTable form={form} />
    </PageWrapper>
  );
};
