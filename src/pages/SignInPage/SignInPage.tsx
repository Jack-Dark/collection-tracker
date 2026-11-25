import type { RouteComponent } from '@tanstack/react-router';

import { Link, useSearch } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

import type { RouterPath } from '#/types';

import { useInvalidateEverything } from '#/api/react-query-hooks/use-invalidate-everything';
import { useInvalidateGetNavMenuCollections } from '#/api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { Button } from '#/components/Button';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { PageWrapper } from '#/components/PageWrapper';
import { useAuth } from '#/providers/AuthProvider';

import { SignInForm } from './components/SignInForm';
import { ResetPasswordDialog } from './components/SignInForm/components/PasswordResetDialog';

export const SignInPage: RouteComponent = () => {
  const invalidateEverything = useInvalidateEverything();
  const searchQueries = useSearch({ from: '/_unprotected/sign-in' });

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const { notifyWarning } = useNotifications();

  const { authLogout } = useAuth();

  const [showResetPasswordDialog, hideResetPasswordDialog] = useDialog(() => {
    return <ResetPasswordDialog hideDialog={hideResetPasswordDialog} />;
  }, []);

  useLayoutEffect(() => {
    if (searchQueries.resetPassword) {
      showResetPasswordDialog();
    }
  }, [searchQueries.resetPassword]);

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

        <SignInForm
          onSuccess={async () => {
            await invalidateGetNavMenuCollections();

            if (searchQueries.redirect) {
              await invalidateEverything({
                thenNavigateToHref: searchQueries.redirect,
              });
            } else {
              await invalidateEverything({
                thenNavigateTo: '/collections' satisfies RouterPath,
              });
            }
          }}
        />

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
