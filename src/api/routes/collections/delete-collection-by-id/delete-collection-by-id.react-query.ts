import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  DeleteCollectionByIdRequestArgsDef,
  DeleteCollectionResponseDef,
} from './delete-collection-by-id.types';

import { useInvalidateGetNavMenuCollections } from '../get-nav-menu-collections/get-nav-menu-collections.react-query';
import { useInvalidateGetPaginatedCollections } from '../get-paginated-collections/get-paginated-collections.react-query';
import { deleteCollectionByIdServerFn } from './delete-collection-by-id.serverFn';

export const useDeleteCollectionById = <
  TTransformedData = DeleteCollectionResponseDef,
>(
  props?: GenericMutateQueryProps<
    DeleteCollectionByIdRequestArgsDef,
    DeleteCollectionResponseDef,
    TTransformedData
  >,
) => {
  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const { onMutate: onDeleteCollectionById, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to delete collection.',
    mutationFn: deleteCollectionByIdServerFn,
    mutationKey: [reactMutationKeys.collections('delete')],
    ...props,
    onSuccess: async (...args) => {
      await invalidateGetNavMenuCollections();
      await invalidateGetPaginatedCollections();

      await props?.onSuccess?.(...args);
    },
  });

  return { ...rest, onDeleteCollectionById };
};
