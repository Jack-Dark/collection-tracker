import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericSuspenseQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetCollectionDetailsByIdRequestArgsDef,
  GetCollectionDetailsByIdResponseDef,
} from './get-collection-details-by-id.types';

import { getCollectionDetailsByIdServerFn } from './get-collection-details-by-id.serverFn';

const getCollectionDetailsByIdQueryDetails = (
  requestArgs: GetCollectionDetailsByIdRequestArgsDef,
) => {
  return {
    queryFn: getCollectionDetailsByIdServerFn,
    queryKey: [
      reactQueryKeys.getCollectionDetailsById,
      requestArgs.collectionId,
      JSON.stringify(requestArgs),
    ],
  } as const;
};

export const getCollectionDetailsByIdQueryOptions = (
  requestArgs: GetCollectionDetailsByIdRequestArgsDef,
) => {
  return getGenericFetchQueryOptions({
    ...getCollectionDetailsByIdQueryDetails(requestArgs),
    requestArgs,
  });
};

export const useGetCollectionDetailsById = <
  TTransformedData = GetCollectionDetailsByIdResponseDef,
>(
  props: GenericFetchProps<
    GetCollectionDetailsByIdRequestArgsDef,
    GetCollectionDetailsByIdResponseDef,
    TTransformedData
  >,
) => {
  return useGenericSuspenseQuery({
    fallbackErrorMessage: 'Unable to retrieve collection details.',
    ...getCollectionDetailsByIdQueryDetails(props.requestArgs),
    ...props,
  });
};

export const useInvalidateGetCollectionDetailsById =
  getUseInvalidateQuery<GetCollectionDetailsByIdRequestArgsDef>(
    reactQueryKeys.getCollectionDetailsById,
  );
