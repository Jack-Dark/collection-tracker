import { ReasonPhrases } from 'http-status-codes';

import { userRoles } from '../auth.constants';
import { getUserSession } from './get-user-session';

/** Same as getSession, but throws an unauthorized error if user does not have an active session. Should only be called in middleware. If you need the session anywhere else use the root route context. */
export const requireAdminUserSession = async () => {
  const user = await getUserSession();

  if (!user?.id || user.role !== userRoles.admin) {
    throw new Error(ReasonPhrases.UNAUTHORIZED);
  }

  return user;
};
