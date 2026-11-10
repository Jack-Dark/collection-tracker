import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router';
import { ReasonPhrases } from 'http-status-codes';

import { getIsAdmin } from '#/auth/helpers/get-is-admin';
import { getUserSessionQueryOptions } from '#/auth/user-session/get-user-session';
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
      const useUserSessionQueryOptions = getUserSessionQueryOptions();

      const user = await context.queryClient.query(useUserSessionQueryOptions);

      if (!user?.id) {
        console.error(ReasonPhrases.UNAUTHORIZED);
        throw redirectToSignIn();
      }

      if (!getIsAdmin(user?.role)) {
        console.error(ReasonPhrases.UNAUTHORIZED);
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
