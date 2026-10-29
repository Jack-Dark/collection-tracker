import type { RouteComponent } from '@tanstack/react-router';

import { Link } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

import { Button } from '#/components/Button';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { PageWrapper } from '#/components/PageWrapper';
import { Route as SignInRoute } from '#/routes/_unprotected/sign-in';

import { SignInForm } from './components/SignInForm';

export const SignInPage: RouteComponent = () => {
  const searchQueries = SignInRoute.useSearch();

  const { notifyWarning } = useNotifications();

  useLayoutEffect(() => {
    if (searchQueries.accountDeleted) {
      notifyWarning('You account has been deleted', {
        keepOpen: true,
        type: 'warning',
      });
    }
  }, []);

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
