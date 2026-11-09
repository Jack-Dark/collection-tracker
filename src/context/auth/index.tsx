import type { Dispatch, SetStateAction } from 'react';

import { createContext, useContext, useState } from 'react';

import type { UserSession } from '#/auth/user-session/session.types';

import { Route as RootRoute } from '#/routes/__root';

type AuthContextDef = {
  setUserSession: SetStateAction<Dispatch<UserSession | null>>;
  userSession: UserSession | null;
};

const AuthContext = createContext<AuthContextDef | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: rootRouteUserContext } = RootRoute.useRouteContext();

  const [userSession, setUserSession] = useState<UserSession | null>(
    rootRouteUserContext,
  );

  return (
    <AuthContext.Provider value={{ setUserSession, userSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
