import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { SignInPage } from '#/pages/SignInPage';

import { createMetaTags } from '../../create-meta-tags';

export const Route = createFileRoute('/_unprotected/sign-in')({
  validateSearch: z.object({
    resetPassword: z.boolean().optional(),
    accountDeleted: z.boolean().optional(),
    redirect: z.string().optional(),
  }),
  component: SignInPage,
  beforeLoad: ({ search, context }) => {
    if (context.user?.id && !search?.resetPassword) {
      console.error('Already logged in - user:', context.user);

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
