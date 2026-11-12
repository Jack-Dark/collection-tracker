import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router';
import { ReasonPhrases } from 'http-status-codes';

import { configs } from '#/configs';
import { Layout } from '#/layout';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context, location }) => {
    const redirectToSignIn = () => {
      return redirect({
        search: { redirect: location.href },
        to: '/sign-in',
      });
    };

    try {
      if (!context.user?.id) {
        console.error(ReasonPhrases.UNAUTHORIZED);
        console.error(
          `${configs.environment} - Protected route. User not logged in - user:`,
          context.user,
        );
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
