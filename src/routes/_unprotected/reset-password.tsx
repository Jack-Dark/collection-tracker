import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { useUserSessionContext } from '#/context/user';
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
  loader: () => {
    const { userSession } = useUserSessionContext();

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
