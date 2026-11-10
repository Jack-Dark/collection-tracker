import { createFileRoute, redirect } from '@tanstack/react-router';

import { getUserSessionQueryOptions } from '#/auth/user-session/get-user-session';
import { SignUpPage } from '#/pages/SignUpPage';

import { createMetaTags } from '../../create-meta-tags';

export const Route = createFileRoute('/_unprotected/sign-up')({
  component: SignUpPage,
  loader: async ({ context }) => {
    const useUserSessionQueryOptions = getUserSessionQueryOptions();

    const user = await context.queryClient.query(useUserSessionQueryOptions);

    if (user?.id) {
      throw redirect({
        to: '/collections',
      });
    }
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
