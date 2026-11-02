import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';

import type { RouterPath } from '#/types';

import { useNotifications } from '#/components/Notifications/useNotifications';

export const useInvalidateEverything = () => {
  const { clearAllNotifications } = useNotifications();

  const router = useRouter();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  return async (options?: { thenNavigateTo: RouterPath }) => {
    await router.invalidate();

    clearAllNotifications();

    queryClient.clear();

    if (options?.thenNavigateTo) {
      navigate({
        to: options.thenNavigateTo,
      });
    }
  };
};
