import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import type { RouterPath } from '#/types';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';
import { auth } from '#/auth/auth-server';

import { requestVerificationEmailRequestSchema } from './request-verification-email.schema';

export const requestVerificationEmailServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(requestVerificationEmailRequestSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    await auth.api.sendVerificationEmail({
      headers,
      body: {
        ...data,
        callbackURL: '/collections' satisfies RouterPath,
      },
    });

    return {
      message: 'Verification email sent!',
    };
  });
