import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { auth } from '#/auth/auth-server';

export const signOutServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .handler(async () => {
    const headers = getRequestHeaders();

    await auth.api.signOut({
      headers,
    });
  });
