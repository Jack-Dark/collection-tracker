import type { RouteComponent } from '@tanstack/react-router';

import { Outlet } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

import { FullPageLoadingSpinner } from './components/FullPageLoadingSpinner';
import { Notifications } from './components/Notifications';
import { useNotifications } from './components/Notifications/useNotifications';
import { SimpleErrorBoundary } from './components/SimpleErrorBoundary';
import { useUserSessionContext } from './context/user';

export const verifyEmailMessage = `You must verify your email address before you can add to your collections. It may be in your spam folder.`;

export const Layout: RouteComponent = () => {
  const { userSession } = useUserSessionContext();

  const { clearAllNotifications, notifyWarning } = useNotifications();

  useLayoutEffect(() => {
    if (userSession?.id && !userSession?.emailVerified) {
      notifyWarning(`Welcome! ${verifyEmailMessage}`, {
        keepOpen: true,
      });
    }

    return clearAllNotifications;
  }, [!!userSession?.emailVerified]);

  return (
    <SimpleErrorBoundary>
      <FullPageLoadingSpinner />
      <Notifications />

      <Outlet />
    </SimpleErrorBoundary>
  );
};
