import { createMiddleware } from '@tanstack/react-start';
import { isAPIError } from 'better-auth/api';

import type { AuthContextDef } from './auth-middleware.types';

import { authAdminSchema, authSchema } from './auth-middleware.schema';
import { getSession, ensureSessionInMiddleware } from './session';

/** Use this middleware to authenticate protected API routes. */
export const authApiRouteMiddleware = createMiddleware().server(
  async ({ next }) => {
    const user = await ensureSessionInMiddleware();

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
  },
);

/** Use this middleware to authenticate protected API routes. */
export const authAdminApiRouteMiddleware = createMiddleware().server(
  async ({ next }) => {
    const user = await ensureSessionInMiddleware();

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

/** Use this middleware to authenticate unprotected API routes. Will try to authorize, but won't throw an error if it fails (unless the response is malformed). */
export const softAuthApiRouteMiddleware = createMiddleware().server(
  async ({ next }) => {
    const user = await getSession();

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
        } as unknown as AuthContextDef,
      });
    }
  },
);

// ! extracting this middleware resolves the server error (in VSCode I technically had to extract all the other middlewares into a separate file because it doesn't want to pull this one out. Not sure why)
export const errorHandlingMiddleware = createMiddleware().server(
  async ({ next }) => {
    try {
      // Executes downstream middleware and the server function itself
      return await next();
    } catch (error) {
      console.error('Error captured by middleware:', error);

      if (error instanceof Error || isAPIError(error)) {
        throw new Error(error.message);
      }

      throw error;
    }
  },
);
