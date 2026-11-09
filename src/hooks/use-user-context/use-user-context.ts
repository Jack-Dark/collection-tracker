import { Route as RootRoute } from '#/routes/__root';

export const useUserContext = () => {
  const { user } = RootRoute.useRouteContext();

  return user;
};
