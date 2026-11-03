import type { UserRoleDef } from './auth-middleware.types';

import { userRoles } from './auth-middleware.schema';

export const getIsAdmin = (role: UserRoleDef | string | null | undefined) => {
  return role === userRoles.admin;
};
