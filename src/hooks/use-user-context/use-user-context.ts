import { useGetUserSession } from '#/auth/user-session/get-user-session';

export const useUserContext = () => {
  const { data } = useGetUserSession({
    placeholderData: {},
    requestArgs: {},
  });

  return data;
};
