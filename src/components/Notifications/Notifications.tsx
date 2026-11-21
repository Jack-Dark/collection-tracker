import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from '@tanstack/react-store';
import { useLayoutEffect } from 'react';
import { twJoin } from 'tailwind-merge';

import { Button } from '../Button';
import { SimpleErrorBoundary } from '../SimpleErrorBoundary';
import { notificationTypes } from './Notifications.constants';
import { notificationsStore } from './useNotifications';

export const Notifications = () => {
  const notifications = useSelector(notificationsStore);

  const clearNotification = (id: string) => {
    notificationsStore.setState((prevNotifications) => {
      return prevNotifications.filter((notification) => {
        return notification.id !== id;
      });
    });
  };

  useLayoutEffect(() => {
    notifications.forEach((notification) => {
      const { id, keepOpen, message, time } = notification;

      if (!!message && !keepOpen) {
        setTimeout(() => {
          clearNotification(id);
        }, time);
      }
    });
  }, [notifications]);

  return (
    <div className="fixed z-99999 t-0 grid w-full">
      {notifications.map((notification) => {
        const { id, keepOpen, message, type } = notification;

        return (
          <div
            className={twJoin(
              `grid grid-cols-[1fr_auto] items-center gap-4 py-1 px-4`,
              type === notificationTypes.success && 'bg-blue-800 text-white',
              type === notificationTypes.warning && 'bg-amber-400 text-black',
              type === notificationTypes.error && 'bg-red-800 text-white',
            )}
            key={id}
          >
            <div className="justify-self-center text-center">
              {typeof message === 'string' ? (
                <p className="text-inherit">{message}</p>
              ) : (
                <SimpleErrorBoundary
                  fallback={
                    <p className="text-inherit">An unknown error occurred.</p>
                  }
                >
                  {/* Error boundary intentionally doubled up to ensure it is caught appropriately */}
                  <SimpleErrorBoundary fallback={null}>
                    {message}
                  </SimpleErrorBoundary>
                </SimpleErrorBoundary>
              )}
            </div>
            {keepOpen && (
              <Button
                aria-label="Close"
                className="text-inherit"
                Icon={<CloseIcon />}
                onClick={() => {
                  return clearNotification(notification.id);
                }}
                size="xs"
                variant="ghost"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
