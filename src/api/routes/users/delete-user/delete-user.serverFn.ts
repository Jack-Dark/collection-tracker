import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';
import { auth } from '#/auth/auth-server';
import { Route as SignInRoute } from '#/routes/_unprotected/sign-in';

import { deleteUserSchema } from './delete-user.schema';

export const deleteUserServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
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
