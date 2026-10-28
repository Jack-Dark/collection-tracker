import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericSuspenseQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetPaginatedCollectionsRequestArgsDef,
  GetPaginatedCollectionsResponseDef,
} from './get-paginated-collections.types';

import { getPaginatedCollectionsServerFn } from './get-paginated-collections.serverFn';

export const useGetPaginatedCollections = <
  TTransformedData = GetPaginatedCollectionsResponseDef,
>(
  props: GenericFetchProps<
    GetPaginatedCollectionsRequestArgsDef,
    GetPaginatedCollectionsResponseDef,
    TTransformedData
  >,
) => {
  return useGenericSuspenseQuery({
    fallbackErrorMessage: 'Unable to retrieve collections.',
    queryFn: getPaginatedCollectionsServerFn,
    queryKey: [
      reactQueryKeys.getPaginatedCollections,
      JSON.stringify(props.requestArgs),
    ],
    ...props,
  });
};

export const useInvalidateGetPaginatedCollections =
  getUseInvalidateQuery<GetPaginatedCollectionsRequestArgsDef>(
    reactQueryKeys.getPaginatedCollections,
  );
