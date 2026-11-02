import { createFileRoute, isRedirect } from '@tanstack/react-router';

import { ensureSession } from '#/auth/auth-middleware';
import { getIsAdmin } from '#/auth/auth-middleware.helpers';
import { Layout } from '#/layout';

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    const redirectToSignIn = () => {
      return Route.redirect({
        search: { redirect: location.href },
        to: '/sign-in',
      });
    };

    try {
      const session = await ensureSession();

      if (!session) {
        throw redirectToSignIn();
      }

      if (!getIsAdmin(session.user?.role)) {
        throw Route.redirect({
          to: '/collections',
        });
      }

      return {
        user: session.user,
      };
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
