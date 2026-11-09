import { useAuth } from '#/context/auth';

export const useUserContext = () => {
  const { userSession } = useAuth();

  return userSession;
};
