import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { auth } from '#/auth/auth';
import { errorHandlingMiddleware } from '#/auth/auth-middleware';

import { signUpRequestSchema } from './sign-up.schema';

export const signUpServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware])
  .validator(signUpRequestSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    await auth.api.signUpEmail({
      headers,
      body: data,
    });
  });
