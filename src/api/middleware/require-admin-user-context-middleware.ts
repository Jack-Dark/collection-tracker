import { createMiddleware } from '@tanstack/react-start';

import type { AuthContextDef } from '../../auth/auth.types';

import { authAdminSchema } from '../../auth/auth.schema';
import { requireUserSession } from '../../auth/user-session';

/** Use this middleware to authenticate protected admin API routes. */
export const requireAdminUserContextMiddleware = createMiddleware().server(
  async ({ next }) => {
    const user = await requireUserSession();

    const { data, error, success } = authAdminSchema.safeParse(user);

    if (success) {
      const context: AuthContextDef = {
        user: data,
      };

      return await next({
        context,
      });
    }

    console.error(error.message);

    throw new Error(error.message);
  },
);
