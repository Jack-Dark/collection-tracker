import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { auth } from '#/auth/auth-server';

import { impersonateUserRequestSchema } from './impersonate-user.schema';

export const impersonateUserServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(impersonateUserRequestSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    await auth.api.impersonateUser({
      headers,
      body: data,
    });
  });
