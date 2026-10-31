import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  CreateCollectionResponseDef,
  CreateCollectionRequestArgsDef,
} from './create-collection.types';

import { useInvalidateGetNavMenuCollections } from '../get-nav-menu-collections/get-nav-menu-collections.react-query';
import { useInvalidateGetPaginatedCollections } from '../get-paginated-collections/get-paginated-collections.react-query';
import { createCollectionServerFn } from './create-collection.serverFn';

export const useCreateCollection = <
  TTransformedData = CreateCollectionResponseDef,
>(
  props?: GenericMutateQueryProps<
    CreateCollectionRequestArgsDef,
    CreateCollectionResponseDef,
    TTransformedData
  >,
) => {
  const invalidateGetPaginatedCollections =
    useInvalidateGetPaginatedCollections();

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const { onMutate: onCreateCollection, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to add collection.',
    mutationFn: createCollectionServerFn,
    mutationKey: [reactMutationKeys.collections.create],
    ...props,
    onSuccess: async (...args) => {
      await invalidateGetNavMenuCollections();
      await invalidateGetPaginatedCollections();

      await props?.onSuccess?.(...args);
    },
  });

  return { ...rest, onCreateCollection };
};
