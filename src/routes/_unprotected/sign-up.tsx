import { createFileRoute, redirect } from '@tanstack/react-router';

import { getUserSession } from '#/auth/user-session/get-user-session';
import { SignUpPage } from '#/pages/SignUpPage';

import { createMetaTags } from '../__root';

export const Route = createFileRoute('/_unprotected/sign-up')({
  component: SignUpPage,
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
        title: 'Sign Up: Collection Tracker',
        description: 'Sign up for a Collection Tracker account.',
      }),
    };
  },
});
