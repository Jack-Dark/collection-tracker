import { createServerOnlyFn } from '@tanstack/react-start';
import { ReasonPhrases } from 'http-status-codes';

import { getUserSession } from './get-user-session';

/** Same as getSession, but throws an unauthorized error if user does not have an active session. Should only be called in middleware. If you need the session anywhere else use the root route context. */
export const requireUserSession = createServerOnlyFn(async () => {
  const user = await getUserSession();

  if (!user?.id) {
    throw new Error(ReasonPhrases.UNAUTHORIZED);
  }

  return user;
});
