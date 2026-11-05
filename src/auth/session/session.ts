import {
  createClientOnlyFn,
  createIsomorphicFn,
  createServerFn,
} from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { ReasonPhrases } from 'http-status-codes';

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

const getServerSession = createServerFn({ method: 'GET' }).handler(async () => {
  const headers = getRequestHeaders();
  const response = await auth.api.getSession({ headers });
  console.log('🚀 ~ SERVER SESSION:', JSON.stringify(response));

  return formatSessionToUserContext(response);
});

const getClientSession = createClientOnlyFn(async () => {
  const { data: response } = await authClient.getSession();
  console.log('🚀 ~ CLIENT SESSION:', JSON.stringify(response));

  return formatSessionToUserContext(response);
});

export const getSession = createIsomorphicFn()
  .server(getServerSession)
  .client(getClientSession);

/** Same as getSession, but throws an unauthorized error if user does not have an active session. Should only be called in middleware. If you need the session anywhere else use the root route context. */
export const ensureSessionInMiddleware = async () => {
  const user = await getSession();

  if (!user?.id) {
    throw new Error(ReasonPhrases.UNAUTHORIZED);
  }

  return user;
};
