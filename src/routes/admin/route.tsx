import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router';
import { ReasonPhrases } from 'http-status-codes';

import { getIsAdmin } from '#/auth/helpers/get-is-admin';
import { Layout } from '#/layout';

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context, location }) => {
    const redirectToSignIn = () => {
      return redirect({
        search: { redirect: location.href },
        to: '/sign-in',
      });
    };

    try {
      if (!context.user?.id) {
        console.error(
          import.meta.env.MODE,
          ReasonPhrases.UNAUTHORIZED,
          '- ID:',
          context.user?.id,
        );
        throw redirectToSignIn();
      }

      if (!getIsAdmin(context.user?.role)) {
        console.error(
          import.meta.env.MODE,
          ReasonPhrases.UNAUTHORIZED,
          '- role:',
          context.user?.role,
        );
        throw redirect({
          to: '/collections',
        });
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
