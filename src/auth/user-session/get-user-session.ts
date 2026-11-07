import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import type { ServerSession, ClientSession } from './session.types';

import { authClient } from '../auth-client';
import { auth } from '../auth-server';

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

export const getUserSession = createIsomorphicFn()
  .server(async () => {
    const headers = getRequestHeaders();
    console.log('🚀 ~ SERVER SESSION HEADERS:', JSON.stringify(headers));
    const response = await auth.api.getSession({ headers });
    console.log('🚀 ~ SERVER SESSION RESPONSE:', JSON.stringify(response));

    return formatSessionToUserContext(response);
  })
  .client(async () => {
    const { data: response } = await authClient.getSession();
    console.log('🚀 ~ CLIENT SESSION:', JSON.stringify(response));

    return formatSessionToUserContext(response);
  });
