import { createFileRoute, isRedirect } from '@tanstack/react-router';
import { ReasonPhrases } from 'http-status-codes';

import { Layout } from '#/layout';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context, location }) => {
    const redirectToSignIn = () => {
      return Route.redirect({
        search: { redirect: location.href },
        to: '/sign-in',
      });
    };

    try {
      console.log('🚀 ~ protected route context:', context.user);
      if (!context.user.id) {
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
