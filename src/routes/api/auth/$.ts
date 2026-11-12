import * as Sentry from '@sentry/tanstackstart-react';
import { createFileRoute } from '@tanstack/react-router';

import { auth } from '#/auth/auth-server';
import { configs } from '#/configs';

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const cookies = request.headers
          .get('cookie')
          ?.split('; ')
          .reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');

            return { ...acc, [key]: value };
          }, {});

        console.log('🚀 ~ AUTH API GET - COOKIES:', cookies);
        Sentry.logger.info(
          '🚀 ~ ' + configs.environment + 'AUTH API GET - COOKIES:',
          cookies,
        );

        return await auth.handler(request);
      },
      POST: async ({ request }: { request: Request }) => {
        const cookie = request.headers
          .get('cookie')
          ?.split('; ')
          .reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');

            return { ...acc, [key]: value };
          }, {});

        console.log(
          '🚀 ~ AUTH API POST - COOKIES:',
          request.headers.get('cookie'),
        );
        Sentry.logger.info(
          '🚀 ~ ' + configs.environment + 'AUTH API GET - COOKIES:',
          cookie,
        );

        return await auth.handler(request);
      },
    },
  },
});
