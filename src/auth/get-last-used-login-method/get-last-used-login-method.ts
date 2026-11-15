import { createIsomorphicFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import Cookies from 'js-cookie';

import type { LastUsedLoginMethod } from './get-last-used-login-method.types';

import { lastUsedLoginMethodCookie } from './get-last-used-login-method.types';

export const getIsLastUsedLoginMethod = createIsomorphicFn()
  .server((method: LastUsedLoginMethod) => {
    const cookieValue = getCookie(lastUsedLoginMethodCookie);

    return method === cookieValue;
  })
  .client((method: LastUsedLoginMethod) => {
    const cookieValue = Cookies.get(lastUsedLoginMethodCookie);

    return method === cookieValue;
  });
