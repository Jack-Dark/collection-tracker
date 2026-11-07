import type { UserRoleDef } from '../auth.types';

import { userRoles } from '../auth.constants';

export const getIsAdmin = (role: UserRoleDef | string | null | undefined) => {
  return role === userRoles.admin;
};
