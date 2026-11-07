import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';
import { auth } from '#/auth/auth-server';

import { updatePasswordRequestSchema } from './update-password.schema';

export const updatePasswordServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(updatePasswordRequestSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    await auth.api.changePassword({
      headers,
      body: {
        ...data,
        revokeOtherSessions: true,
      },
    });

    return { message: 'Your password has been reset' };
  });
