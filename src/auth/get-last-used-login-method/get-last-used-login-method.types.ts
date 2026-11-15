import type { ObjectValues } from '#/types';

import type { lastUsedLoginMethods } from './get-last-used-login-method.constants';

export type LastUsedLoginMethod = ObjectValues<typeof lastUsedLoginMethods>;

export const lastUsedLoginMethodCookie = 'better-auth.last_used_login_method';
