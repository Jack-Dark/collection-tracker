import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  OnUpdateCollectionsArgsDef,
  UpdateCollectionByIdResponseDef,
} from './update-collection-by-id.types';

import { useInvalidateGetNavMenuCollections } from '../get-nav-menu-collections/get-nav-menu-collections.react-query';
import { useInvalidateGetPaginatedCollections } from '../get-paginated-collections/get-paginated-collections.react-query';
import { updateCollectionByIdServerFn } from './update-collection-by-id.serverFn';

export const useUpdateCollectionById = <
  TTransformedData = UpdateCollectionByIdResponseDef,
>(
  props?: GenericMutateQueryProps<
    OnUpdateCollectionsArgsDef,
    UpdateCollectionByIdResponseDef,
    TTransformedData
  >,
) => {
  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const { onMutate: onUpdateCollectionById, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to update collection.',
    mutationFn: updateCollectionByIdServerFn,
    mutationKey: [reactMutationKeys.collections.update],
    ...props,
    onSuccess: async (...args) => {
      await invalidateGetNavMenuCollections();
      await invalidateGetPaginatedCollections();

      await props?.onSuccess?.(...args);
    },
  });

  return { ...rest, onUpdateCollectionById };
};
