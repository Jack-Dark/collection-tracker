import type { RouteComponent } from '@tanstack/react-router';

import { Link, useSearch } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

import { Button } from '#/components/Button';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { PageWrapper } from '#/components/PageWrapper';
import { useAuth } from '#/providers/AuthProvider';

import { SignInForm } from './components/SignInForm';

export const SignInPage: RouteComponent = () => {
  const searchQueries = useSearch({ from: '/_unprotected/sign-in' });

  const { notifyWarning } = useNotifications();

  const { authLogout } = useAuth();

  useLayoutEffect(() => {
    if (searchQueries.accountDeleted) {
      notifyWarning('You account has been deleted', {
        keepOpen: true,
        type: 'warning',
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (searchQueries.logout) {
      authLogout();
    }
  }, [searchQueries.logout]);

  return (
    <PageWrapper>
      <div className="grid gap-10">
        <h1>Sign In</h1>

        <SignInForm />

        <div className="flex gap-4 items-center flex-wrap text-sm">
          <p>Don't have an account yet?</p>
          <Link to="/sign-up">
            <Button size="sm" variant="secondary">
              Sign up!
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};
