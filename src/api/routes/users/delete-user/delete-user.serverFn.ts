import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import type { RouterPath } from '#/types';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';
import { auth } from '#/auth/auth-server';

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
        callbackURL: `${'/sign-in' satisfies RouterPath}?accountDeleted=true`,
      },
      headers,
    });
  });
