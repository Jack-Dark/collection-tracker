import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import type { RouterPath } from '#/types';

import { auth } from '#/auth/auth';
import { errorHandlingMiddleware } from '#/auth/auth-middleware';

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
