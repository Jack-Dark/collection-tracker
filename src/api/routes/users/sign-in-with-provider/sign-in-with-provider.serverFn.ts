import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import type { RouterPath } from '#/types';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { auth } from '#/auth/auth-server';

import { signInWithProviderRequestSchema } from './sign-in-with-provider.schema';

export const signInWithProviderServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(signInWithProviderRequestSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    return auth.api.signInSocial({
      headers,
      body: {
        ...data,
        callbackURL: '/collections' satisfies RouterPath,
      },
    });
  });
