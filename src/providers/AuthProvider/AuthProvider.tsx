import type { PropsWithChildren } from 'react';

import { useRouter } from '@tanstack/react-router';
import { createContext, use, useState } from 'react';

import type { UserSession } from '#/auth/user-session/session.types';

type AuthDef = {
  isAuthenticated: boolean;
  user: UserSession;
};

type AuthContextVal = AuthDef & {
  authLogout: () => void;
  updateAuthSession: (user: UserSession) => void;
};

const AuthContext = createContext<AuthContextVal | null>(null);

type AuthProviderPropsDef = PropsWithChildren<{
  initialAuth: AuthDef;
}>;

export const AuthProvider = ({
  children,
  initialAuth,
}: AuthProviderPropsDef) => {
  const [auth, setAuth] = useState<AuthDef>(initialAuth);

  const router = useRouter();

  const authLogout = () => {
    setAuth({ isAuthenticated: false, user: null });
    router.invalidate();
  };

  const updateAuthSession = (user: UserSession): void => {
    if (user?.id) {
      setAuth({ isAuthenticated: true, user });
    } else if (auth.user?.id) {
      authLogout();
    }
  };

  return (
    <AuthContext value={{ ...auth, authLogout, updateAuthSession }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const context = use(AuthContext);
  if (!context) throw new Error('useAuth called outside of AuthProvider!');

  return context;
};
