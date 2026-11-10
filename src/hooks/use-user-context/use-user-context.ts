import { useRouteContext } from '@tanstack/react-router';

export const useUserContext = () => {
  const { user } = useRouteContext({ from: '__root__' });

  return user;
};
