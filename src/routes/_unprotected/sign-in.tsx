import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { getUserSessionQueryOptions } from '#/auth/user-session/get-user-session';
import { SignInPage } from '#/pages/SignInPage';

import { createMetaTags } from '../../create-meta-tags';

export const Route = createFileRoute('/_unprotected/sign-in')({
  validateSearch: z.object({
    resetPassword: z.boolean().optional(),
    accountDeleted: z.boolean().optional(),
    redirect: z.string().optional(),
  }),
  component: SignInPage,
  loaderDeps: ({ search }) => {
    return search;
  },
  loader: async ({ context, deps: searchQueries }) => {
    const useUserSessionQueryOptions = getUserSessionQueryOptions();

    const user = await context.queryClient.query(useUserSessionQueryOptions);

    if (user?.id && !searchQueries?.resetPassword) {
      throw redirect({
        to: '/collections',
      });
    }
  },
  head: () => {
    return {
      meta: createMetaTags({
        title: 'Sign In: Collection Tracker',
        description: 'Sign in to your Collection Tracker account.',
      }),
    };
  },
});
