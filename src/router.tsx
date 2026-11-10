import type { ErrorComponentProps } from '@tanstack/react-router';

import * as Sentry from '@sentry/tanstackstart-react';
import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { useEffect } from 'react';

import { Button } from './components/Button';
import { PageWrapper } from './components/PageWrapper';
import { RouteCatchBoundary } from './components/RouteCatchBoundary';
import { githubUrl } from './constants/githubUrl';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });

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

const RouteNotFoundComponent = () => {
  return (
    <PageWrapper>
      <div className="grid gap-10">
        <h1>Page Not Found</h1>
        <p>
          Ack! You caught us with our pants down! If you think this is bug, you
          can help us out by reporting it.
        </p>
        <a href={githubUrl.issues} target="_blank">
          <Button text="Report Bug" />
        </a>
      </div>
    </PageWrapper>
  );
};

const RouteErrorComponent = (props: ErrorComponentProps) => {
  const { error } = props;

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return <RouteCatchBoundary {...props} />;
};
