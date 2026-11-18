import { createFileRoute, redirect } from '@tanstack/react-router';

import { signOutServerFn } from '#/api/routes/users/sign-out/sign-out.serverFn';

export const Route = createFileRoute('/_unprotected/sign-out')({
  loader: async () => {
    await signOutServerFn();

    throw redirect({
      to: '/sign-in',
      search: {
        logout: true,
      },
    });
  },
});
