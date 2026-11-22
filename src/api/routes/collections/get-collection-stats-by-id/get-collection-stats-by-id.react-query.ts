import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericSuspenseQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetCollectionStatsByIdRequestArgsDef,
  GetCollectionStatsByIdResponseDef,
} from './get-collection-stats-by-id.types';

import { getCollectionStatsByIdServerFn } from './get-collection-stats-by-id.serverFn';

const getCollectionStatsByIdQueryDetails = (
  requestArgs: GetCollectionStatsByIdRequestArgsDef,
) => {
  return {
    queryFn: getCollectionStatsByIdServerFn,
    queryKey: [reactQueryKeys.getCollectionStatsById, requestArgs.collectionId],
  } as const;
};

export const getCollectionStatsByIdQueryOptions = (
  requestArgs: GetCollectionStatsByIdRequestArgsDef,
) => {
  return getGenericFetchQueryOptions({
    ...getCollectionStatsByIdQueryDetails(requestArgs),
    requestArgs,
  });
};

export const useGetCollectionStatsById = <
  TTransformedData = GetCollectionStatsByIdResponseDef,
>(
  props: GenericFetchProps<
    GetCollectionStatsByIdRequestArgsDef,
    GetCollectionStatsByIdResponseDef,
    TTransformedData
  >,
) => {
  return useGenericSuspenseQuery({
    fallbackErrorMessage: 'Unable to retrieve collection details.',
    ...getCollectionStatsByIdQueryDetails(props.requestArgs),
    ...props,
  });
};

export const useInvalidateGetCollectionStatsById =
  getUseInvalidateQuery<GetCollectionStatsByIdRequestArgsDef>(
    reactQueryKeys.getCollectionStatsById,
  );
