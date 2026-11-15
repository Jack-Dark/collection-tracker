import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
} from '@sentry/tanstackstart-react';
import { createCsrfMiddleware, createStart } from '@tanstack/react-start';

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => {
    return ctx.handlerType === 'serverFn';
  },
});

export const startInstance = createStart(() => {
  return {
    functionMiddleware: [sentryGlobalFunctionMiddleware],
    requestMiddleware: [csrfMiddleware, sentryGlobalRequestMiddleware],
  };
});
