import { useLoaderData } from '@tanstack/react-router';

export const useUserContext = () => {
  const { user } = useLoaderData({ from: '__root__' });

  return user;
};
