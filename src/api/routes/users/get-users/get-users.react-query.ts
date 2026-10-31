import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericFetchQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetUsersRequestArgsDef,
  GetUsersResponseDef,
} from './get-users.types';

import { getUsersServerFn } from './get-users.serverFn';

export const useGetUsers = <TTransformedData = GetUsersResponseDef>(
  props: GenericFetchProps<
    GetUsersRequestArgsDef,
    GetUsersResponseDef,
    TTransformedData
  >,
) => {
  return useGenericFetchQuery({
    fallbackErrorMessage: 'Unable to get users.',
    queryFn: getUsersServerFn,
    queryKey: [
      reactQueryKeys.getPaginatedUsers,
      JSON.stringify(props.requestArgs),
    ],
    ...props,
  });
};

export const useInvalidateGetUsers =
  getUseInvalidateQuery<GetUsersRequestArgsDef>(
    reactQueryKeys.getPaginatedUsers,
  );
