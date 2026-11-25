import { createFileRoute } from '@tanstack/react-router';

import { RouteNotFoundComponent } from '#/router';

export const Route = createFileRoute('/_unprotected/404')({
  component: RouteNotFoundComponent,
});
