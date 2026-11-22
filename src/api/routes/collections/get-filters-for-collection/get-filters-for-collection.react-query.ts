import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetFiltersForCollectionRequestArgsDef,
  GetFiltersForCollectionResponseDef,
} from './get-filters-for-collection.types';

import { getFiltersForCollectionServerFn } from './get-filters-for-collection.serverFn';

export const useGetFiltersForCollection = <
  TTransformedData = GetFiltersForCollectionResponseDef,
>(
  props: GenericFetchProps<
    GetFiltersForCollectionRequestArgsDef,
    GetFiltersForCollectionResponseDef,
    TTransformedData
  >,
) => {
  return useGenericQuery({
    fallbackErrorMessage: 'Unable to retrieve collection details.',
    queryFn: getFiltersForCollectionServerFn,
    queryKey: [reactQueryKeys.getFiltersForCollection, props.requestArgs.id],
    ...props,
  });
};

export const useInvalidateGetFiltersForCollection =
  getUseInvalidateQuery<GetFiltersForCollectionRequestArgsDef>(
    reactQueryKeys.getFiltersForCollection,
  );
