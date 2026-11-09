import { createFileRoute, redirect } from '@tanstack/react-router';

import { useUserSessionContext } from '#/context/user';
import { SignUpPage } from '#/pages/SignUpPage';

import { createMetaTags } from '../__root';

export const Route = createFileRoute('/_unprotected/sign-up')({
  component: SignUpPage,
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
        title: 'Sign Up: Collection Tracker',
        description: 'Sign up for a Collection Tracker account.',
      }),
    };
  },
});
