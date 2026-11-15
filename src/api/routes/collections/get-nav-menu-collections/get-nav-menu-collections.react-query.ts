import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericSuspenseQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetNavMenuCollectionsRequestArgsDef,
  GetNavMenuCollectionsResponseDef,
} from './get-nav-menu-collections.types';

import { getNavMenuCollectionsServerFn } from './get-nav-menu-collections.serverFn';

const getNavMenuCollectionsQueryDetails = () => {
  return {
    queryFn: getNavMenuCollectionsServerFn,
    queryKey: [reactQueryKeys.getNavMenuCollections],
  } as const;
};

export const getNavMenuCollectionsQueryOptions = () => {
  return getGenericFetchQueryOptions({
    ...getNavMenuCollectionsQueryDetails(),
    requestArgs: {},
  });
};

export const useGetNavMenuCollections = <
  TTransformedData = GetNavMenuCollectionsResponseDef,
>(
  props: GenericFetchProps<
    GetNavMenuCollectionsRequestArgsDef,
    GetNavMenuCollectionsResponseDef,
    TTransformedData
  >,
) => {
  return useGenericSuspenseQuery({
    fallbackErrorMessage: 'Unable to retrieve collections for nav menu.',
    ...getNavMenuCollectionsQueryDetails(),
    ...props,
  });
};

export const useInvalidateGetNavMenuCollections =
  getUseInvalidateQuery<GetNavMenuCollectionsRequestArgsDef>(
    reactQueryKeys.getNavMenuCollections,
  );
