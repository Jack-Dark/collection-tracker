import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

import { RouteErrorComponent, RouteNotFoundComponent } from './routes/__root';
import { routeTree } from './routeTree.gen';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function getRouter() {
  const router = createRouter({
    context: { queryClient },
    defaultErrorComponent: RouteErrorComponent,
    defaultNotFoundComponent: RouteNotFoundComponent,
    defaultPreload: 'intent',
    routeTree,
  });

  setupRouterSsrQueryIntegration({
    queryClient,
    router,
  });

  return router;
}
