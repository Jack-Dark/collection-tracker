import { createStore } from '@tanstack/react-store';
import { v4 as uuidv4 } from 'uuid';

import type { NotificationDetails, Notify } from './Notifications.types';

import { notificationTypes } from './Notifications.constants';

export const notificationsStore = createStore<NotificationDetails[]>([]);

export const createNewNotification = (
  newNotification: Omit<NotificationDetails, 'id'>,
) => {
  const {
    closeOthersOfType,
    keepOpen = false,
    message = '',
    time = 2500,
    type = 'success',
  } = newNotification;

  if (message) {
    notificationsStore.setState((prevNotifications) => {
      const purifiedNotificationsList = prevNotifications.filter(
        (prevNotification) => {
          if (closeOthersOfType && type === prevNotification.type) {
            return false;
          }

          return true;
        },
      );

      const newNotification: NotificationDetails = {
        id: uuidv4(),
        keepOpen,
        message,
        time,
        type,
      };

      return [...purifiedNotificationsList, newNotification];
    });
  }
};

export const useNotifications = () => {
  const notify: Notify = (message, options = {}) => {
    createNewNotification({
      closeOthersOfType: true,
      message,
      type: notificationTypes.success,
      ...options,
    });
  };

  const notifyWarning: Notify = (message, options = {}) => {
    createNewNotification({
      message,
      type: notificationTypes.warning,
      ...options,
    });
  };

  const notifyError: Notify = (message, options = {}) => {
    createNewNotification({
      message,
      type: notificationTypes.error,
      ...options,
    });
  };

  const clearAllNotifications = () => {
    notificationsStore.setState(() => {
      return [];
    });
  };

  return { clearAllNotifications, notify, notifyError, notifyWarning };
};
