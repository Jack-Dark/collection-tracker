import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericSuspenseQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetPaginatedCollectionsRequestArgsDef,
  GetPaginatedCollectionsResponseDef,
} from './get-paginated-collections.types';

import { getPaginatedCollectionsServerFn } from './get-paginated-collections.serverFn';

const getPaginatedCollectionsQueryDetails = (
  requestArgs: GetPaginatedCollectionsRequestArgsDef,
) => {
  return {
    queryFn: getPaginatedCollectionsServerFn,
    queryKey: [
      reactQueryKeys.getPaginatedCollections,
      JSON.stringify(requestArgs),
    ],
  } as const;
};

export const getPaginatedCollectionsQueryOptions = (
  requestArgs: GetPaginatedCollectionsRequestArgsDef,
) => {
  return getGenericFetchQueryOptions({
    ...getPaginatedCollectionsQueryDetails(requestArgs),
    requestArgs,
  });
};

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
    ...getPaginatedCollectionsQueryDetails(props.requestArgs),
    ...props,
  });
};

export const useInvalidateGetPaginatedCollections =
  getUseInvalidateQuery<GetPaginatedCollectionsRequestArgsDef>(
    reactQueryKeys.getPaginatedCollections,
  );
