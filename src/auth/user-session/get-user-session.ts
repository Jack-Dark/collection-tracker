import type { QueryOptions } from '@tanstack/react-query';

import * as Sentry from '@sentry/tanstackstart-react';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericSuspenseQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  ServerUserSession,
  ClientUserSession,
  UserSession,
} from './session.types';

import { authClient } from '../auth-client';
import { auth } from '../auth-server';

const formatSessionToUserContext = (
  sessionResponse: ServerUserSession | ClientUserSession | null,
) => {
  return {
    email: sessionResponse?.user.email || '',
    emailVerified: sessionResponse?.user.emailVerified || false,
    id: sessionResponse?.user.id || '',
    impersonatedBy: sessionResponse?.session?.impersonatedBy,
    name: sessionResponse?.user.name || '',
    role: sessionResponse?.user?.role,
  };
};

export const getUserSession = createIsomorphicFn()
  .server(async () => {
    const headers = getRequestHeaders();
    console.log('🚀 ~ SERVER SESSION HEADERS:', JSON.stringify(headers));
    const response = await auth.api.getSession({ headers });
    console.log('🚀 ~ SERVER SESSION RESPONSE:', JSON.stringify(response));

    Sentry.logger.info('🚀 ~ SERVER SESSION RESPONSE:', response ?? {});

    return formatSessionToUserContext(response);
  })
  .client(async () => {
    const { data: response } = await authClient.getSession();
    console.log('🚀 ~ CLIENT SESSION:', JSON.stringify(response));

    return formatSessionToUserContext(response);
  });

type GetUserSessionArgs = {};

const getUserSessionQueryDetails = () => {
  return {
    gcTime: 0,
    queryFn: getUserSession,
    queryKey: [reactQueryKeys.getUserSession],
  } as const satisfies Partial<QueryOptions>;
};

export const getUserSessionQueryOptions = () => {
  return getGenericFetchQueryOptions({
    ...getUserSessionQueryDetails(),
    requestArgs: {},
  });
};

export const useGetUserSession = <TTransformedData = UserSession>(
  props: GenericFetchProps<GetUserSessionArgs, UserSession, TTransformedData>,
) => {
  return useGenericSuspenseQuery({
    fallbackErrorMessage: 'Unable to retrieve user session.',
    ...getUserSessionQueryDetails(),
    ...props,
  });
};

export const useInvalidateGetUserSession =
  getUseInvalidateQuery<GetUserSessionArgs>(reactQueryKeys.getUserSession);
