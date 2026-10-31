import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/auth/auth';
import { errorHandlingMiddleware } from '#/auth/auth-middleware';

import { signInWithEmailRequestSchema } from './sign-in-with-email.schema';

export const signInWithEmailServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(signInWithEmailRequestSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    return auth.api.signInEmail({
      headers,
      body: data,
    });
  });
