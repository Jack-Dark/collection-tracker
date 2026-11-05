import { createFileRoute, isRedirect } from '@tanstack/react-router';
import { ReasonPhrases } from 'http-status-codes';

import { getSession } from '#/auth/session';
import { Layout } from '#/layout';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    const redirectToSignIn = () => {
      return Route.redirect({
        search: { redirect: location.href },
        to: '/sign-in',
      });
    };

    try {
      const user = await getSession();

      if (!user.id) {
        console.error(ReasonPhrases.UNAUTHORIZED);
        throw redirectToSignIn();
      }
    } catch (error) {
      // ? Re-throw redirects (they're intentional, not errors)
      if (isRedirect(error)) {
        throw error;
      }

      // ? Auth check failed (network error, etc.) - redirect to login
      throw redirectToSignIn();
    }
  },
  component: Layout,
});
