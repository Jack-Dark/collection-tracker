import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/auth/auth';
import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';
import { Route as SignInRoute } from '#/routes/_unprotected/sign-in';

import { deleteUserSchema } from './delete-user.schema';

export const deleteUserServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(deleteUserSchema)
  .handler(async () => {
    const headers = getRequestHeaders();

    await auth.api.deleteUser({
      body: {
        callbackURL: `${SignInRoute.to}?accountDeleted=true`,
      },
      headers,
    });
  });
