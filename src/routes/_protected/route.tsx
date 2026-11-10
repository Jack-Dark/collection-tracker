import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router';
import { ReasonPhrases } from 'http-status-codes';

import { getUserSessionQueryOptions } from '#/auth/user-session/get-user-session';
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
      const useSessionQueryOptions = getUserSessionQueryOptions();
      const user = await context.queryClient.query(useSessionQueryOptions);

      if (!user?.id) {
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
