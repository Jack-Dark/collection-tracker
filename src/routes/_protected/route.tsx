import { createFileRoute, isRedirect } from '@tanstack/react-router';

import { Layout } from '#/layout';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location, context }) => {
    const redirectToSignIn = () => {
      return Route.redirect({
        search: { redirect: location.href },
        to: '/sign-in',
      });
    };

    try {
      if (!context.user.id) {
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
