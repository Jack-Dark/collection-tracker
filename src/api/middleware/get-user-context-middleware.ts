import { createMiddleware } from '@tanstack/react-start';

import type { AuthContextDef } from '../../auth/auth.types';

import { authSchema } from '../../auth/auth.schema';
import { getUserSession } from '../../auth/user-session/get-user-session';

/** Use this middleware to authenticate unprotected API routes. Will try to authorize, but won't throw an error if it fails (unless the response is malformed). */
export const getUserContextMiddleware = createMiddleware().server(
  async ({ next }) => {
    const user = await getUserSession();

    if (user?.id) {
      const { data, error, success } = authSchema.safeParse(user);

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
    } else {
      return await next({
        context: {
          user: {},
        } as AuthContextDef,
      });
    }
  },
);
