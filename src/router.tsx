import BugReportIcon from '@mui/icons-material/BugReport';
import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

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
    context: { queryClient, user: null },
    defaultErrorComponent: RouteCatchBoundary,
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

export const RouteNotFoundComponent = () => {
  return (
    <PageWrapper>
      <div className="grid gap-10">
        <h1>Page Not Found</h1>
        <p>
          This page either does not exist or you are not authorized to view it.
        </p>

        <div className="grid gap-2">
          <p>If you think this is bug, you can help us out by reporting it!</p>
          <a href={githubUrl.issues} target="_blank">
            <Button
              icon={<BugReportIcon fontSize="inherit" />}
              iconPosition="right"
              size="sm"
              text="Report Bug"
              variant="secondary"
            />
          </a>
        </div>
      </div>
    </PageWrapper>
  );
};
