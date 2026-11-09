import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { getUserSession } from '#/auth/user-session/get-user-session';
import { ResetPasswordPage } from '#/pages/ResetPasswordPage';

import { createMetaTags } from '../__root';

const resetPasswordSearchSchema = z.object({
  email: z.email().optional(),
  token: z.string().min(1).optional(),
  error: z.string().min(1).optional(),
});

export const Route = createFileRoute('/_unprotected/reset-password')({
  validateSearch: resetPasswordSearchSchema,
  component: ResetPasswordPage,
  loader: async () => {
    const userSession = await getUserSession();

    if (userSession?.id)
      throw redirect({
        to: '/collections',
      });
  },
  head: () => {
    return {
      meta: createMetaTags({
        title: 'Reset Password: Collection Tracker',
        description: 'Reset the password to your Collection Tracker account.',
      }),
    };
  },
});
