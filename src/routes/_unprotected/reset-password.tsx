import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { getSession } from '#/auth/auth-middleware';
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
  beforeLoad: () => {
    return getSession();
  },
  loader: ({ context }) => {
    if (context.user?.id)
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
