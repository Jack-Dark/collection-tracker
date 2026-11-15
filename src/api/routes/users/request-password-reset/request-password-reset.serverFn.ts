import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import type { RouterPath } from '#/types';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { auth } from '#/auth/auth-server';

import { requestPasswordResetSchema } from './request-password-reset.schema';

export const requestPasswordResetServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(requestPasswordResetSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    const encodedEmail = encodeURI(data.email).replace(/\+/g, '%2B');
    const redirectPath = '/reset-password' satisfies RouterPath;
    const redirectTo = `${redirectPath}?email=${encodedEmail}`;

    const { message, status } = await auth.api.requestPasswordReset({
      body: {
        ...data,
        redirectTo,
      },
      headers,
    });

    if (!status) {
      throw new Error('Unable to reset password');
    }

    return { message };
  });
