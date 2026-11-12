import * as Sentry from '@sentry/tanstackstart-react';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

import { configs } from '#/configs';

import type { ServerUserSession, ClientUserSession } from './session.types';

import { authClient } from '../auth-client';
import { auth } from '../auth-server';

const formatSessionToUserContext = (
  sessionResponse: ServerUserSession | ClientUserSession | null,
) => {
  return sessionResponse
    ? {
        email: sessionResponse.user.email || '',
        emailVerified: sessionResponse.user.emailVerified || false,
        id: sessionResponse.user.id || '',
        impersonatedBy: sessionResponse.session?.impersonatedBy,
        name: sessionResponse.user.name || '',
        role: sessionResponse.user?.role,
      }
    : null;
};

export const getUserSession = createIsomorphicFn()
  .server(async () => {
    const headers = getRequestHeaders();

    const cookies = headers
      .get('cookie')
      ?.split('; ')
      .reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');

        return { ...acc, [key]: value };
      }, {});

    const response = await auth.api.getSession({ headers });

    console.log('🚀 ~ SERVER SESSION RAW COOKIES:', headers.get('cookie'));
    console.log(
      '🚀 ~ SERVER SESSION FORMATTED COOKIES:',
      JSON.stringify(cookies),
    );
    console.log('🚀 ~ SERVER SESSION RESPONSE:', JSON.stringify(response));

    Sentry.logger.info(
      '🚀 ~ ' + configs.environment + 'SERVER SESSION HEADER COOKIES:',
      cookies,
    );
    Sentry.logger.info(
      '🚀 ~ ' + configs.environment + 'SERVER SESSION RESPONSE:',
      response ?? {},
    );

    return formatSessionToUserContext(response);
  })
  .client(async () => {
    const { data: response } = await authClient.getSession();
    console.log('🚀 ~ CLIENT SESSION:', JSON.stringify(response));

    return formatSessionToUserContext(response);
  });
