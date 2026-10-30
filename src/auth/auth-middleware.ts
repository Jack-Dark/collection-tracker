import { createMiddleware, createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { isAPIError } from 'better-auth/api';
import { ReasonPhrases } from 'http-status-codes';

import type { AuthContextDef } from './auth-middleware.types';

import { auth } from './auth';
import { authAdminSchema, authSchema } from './auth-middleware.schema';

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders();

    return auth.api.getSession({ headers });
  },
);

export const ensureSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSession();

    if (!session) {
      throw new Error(ReasonPhrases.UNAUTHORIZED);
    }

    return session;
  },
);

/** Use this middleware to authenticate protected API routes. */
export const authApiRouteMiddleware = createMiddleware().server(
  async ({ next }) => {
    const response = await ensureSession();

    const { data, error, success } = authSchema.safeParse(response.user);

    if (success) {
      const context: AuthContextDef = {
        user: {
          ...data,
          impersonatedBy: response.session.impersonatedBy,
        },
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
    const response = await ensureSession();

    const { data, error, success } = authAdminSchema.safeParse(response.user);

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
    const response = await getSession();

    if (response) {
      const { data, error, success } = authSchema.safeParse(response.user);

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

export const errorHandlingMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
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
});
