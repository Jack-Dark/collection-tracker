import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import type { ServerUserSession, ClientUserSession } from './session.types';

import { authClient } from '../auth-client';
import { auth } from '../auth-server';

const formatSessionToUserContext = (
  sessionResponse: ServerUserSession | ClientUserSession | null,
) => {
  return sessionResponse?.user?.id
    ? {
        email: sessionResponse.user.email,
        emailVerified: sessionResponse.user.emailVerified,
        id: sessionResponse.user.id,
        impersonatedBy: sessionResponse.session.impersonatedBy,
        name: sessionResponse.user.name,
        role: sessionResponse.user.role,
      }
    : null;
};

export const getUserSession = createIsomorphicFn()
  .server(async () => {
    const headers = getRequestHeaders();
    const response = await auth.api.getSession({ headers });

    return formatSessionToUserContext(response);
  })
  .client(async () => {
    const { data: response } = await authClient.getSession();

    return formatSessionToUserContext(response);
  });
