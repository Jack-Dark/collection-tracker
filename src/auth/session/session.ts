import { createIsomorphicFn } from '@tanstack/react-start';
import { getCookie, getRequestHeaders } from '@tanstack/react-start/server';
import { ReasonPhrases } from 'http-status-codes';
import Cookies from 'js-cookie';

import type { ObjectValues } from '#/types';

import type { ServerSession, ClientSession } from './session.types';

import { auth } from '../auth';
import { authClient } from '../auth-client';

const formatSessionToUserContext = (
  sessionResponse: ServerSession | ClientSession | null,
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

export const getSession = createIsomorphicFn()
  .server(async () => {
    const headers = getRequestHeaders();
    const response = await auth.api.getSession({ headers });
    console.log('🚀 ~ SERVER SESSION:', JSON.stringify(response));

    return formatSessionToUserContext(response);
  })
  .client(async () => {
    const { data: response } = await authClient.getSession();
    console.log('🚀 ~ CLIENT SESSION:', JSON.stringify(response));

    return formatSessionToUserContext(response);
  });

/** Same as getSession, but throws an unauthorized error if user does not have an active session. Should only be called in middleware. If you need the session anywhere else use the root route context. */
export const ensureSessionInMiddleware = async () => {
  const user = await getSession();

  if (!user?.id) {
    throw new Error(ReasonPhrases.UNAUTHORIZED);
  }

  return user;
};

export const lastUsedLoginMethods = {
  email: 'email',
  google: 'google',
} as const;

type LastUsedLoginMethod = ObjectValues<typeof lastUsedLoginMethods>;
const lastUsedLoginMethodCookie = 'better-auth.last_used_login_method';

export const getIsLastUsedLoginMethod = createIsomorphicFn()
  .server((method: LastUsedLoginMethod) => {
    const cookieValue = getCookie(lastUsedLoginMethodCookie);

    return method === cookieValue;
  })
  .client((method: LastUsedLoginMethod) => {
    const cookieValue = Cookies.get(lastUsedLoginMethodCookie);

    return method === cookieValue;
  });
