import type { RouteComponent } from '@tanstack/react-router';

import { Outlet, useLoaderData } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

import { FullPageLoadingSpinner } from './components/FullPageLoadingSpinner';
import { Notifications } from './components/Notifications';
import { useNotifications } from './components/Notifications/useNotifications';
import { SimpleErrorBoundary } from './components/SimpleErrorBoundary';
import { useAuth } from './providers/AuthProvider';

export const verifyEmailMessage = `You must verify your email address before you can add to your collections. It may be in your spam folder.`;

export const Layout: RouteComponent = () => {
  const rootData = useLoaderData({ from: '__root__' });

  const { isAuthenticated, updateAuthSession, user } = useAuth();

  const { clearAllNotifications, notifyWarning } = useNotifications();

  useLayoutEffect(() => {
    updateAuthSession(rootData.user);
  }, [rootData.user]);

  useLayoutEffect(() => {
    if (isAuthenticated && !user?.emailVerified) {
      notifyWarning(`Welcome! ${verifyEmailMessage}`, {
        keepOpen: true,
      });
    }

    return clearAllNotifications;
  }, [!!user?.emailVerified]);

  return (
    <SimpleErrorBoundary>
      <FullPageLoadingSpinner />
      <Notifications />

      <Outlet />
    </SimpleErrorBoundary>
  );
};
