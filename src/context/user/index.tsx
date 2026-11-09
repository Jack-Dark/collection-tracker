import type { PropsWithChildren } from 'react';

import { createContext, use, useLayoutEffect, useState } from 'react';

import type { UserSession } from '#/auth/user-session/session.types';

type UserSessionContextVal = {
  setUserSession: (userSession: UserSession) => void;
  userSession: UserSession;
};

const UserSessionContext = createContext<UserSessionContextVal | null>(null);

type UserSessionProviderPropsDef = PropsWithChildren<{
  initialUserSession: UserSession;
}>;

export const UserSessionProvider = ({
  children,
  initialUserSession,
}: UserSessionProviderPropsDef) => {
  const [userSession, setUserSession] =
    useState<UserSession>(initialUserSession);

  useLayoutEffect(() => {
    setUserSession(initialUserSession);
  }, [initialUserSession]);

  return (
    <UserSessionContext value={{ setUserSession, userSession }}>
      {children}
    </UserSessionContext>
  );
};

export const useUserSessionContext = () => {
  const context = use(UserSessionContext);
  if (!context)
    throw new Error('useUserContext called outside of UserSessionProvider!');

  return context;
};
