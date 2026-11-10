import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { getUserSessionQueryOptions } from '#/auth/user-session/get-user-session';
import { ResetPasswordPage } from '#/pages/ResetPasswordPage';

import { createMetaTags } from '../../create-meta-tags';

const resetPasswordSearchSchema = z.object({
  email: z.email().optional(),
  token: z.string().min(1).optional(),
  error: z.string().min(1).optional(),
});

export const Route = createFileRoute('/_unprotected/reset-password')({
  validateSearch: resetPasswordSearchSchema,
  component: ResetPasswordPage,
  loader: async ({ context }) => {
    const useUserSessionQueryOptions = getUserSessionQueryOptions();

    const user = await context.queryClient.query(useUserSessionQueryOptions);

    if (user?.id)
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
