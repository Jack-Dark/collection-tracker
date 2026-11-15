import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { getUserContextMiddleware } from '#/api/middleware/get-user-context-middleware';

import { getNavMenuCollectionsDbQuery } from './get-nav-menu-collections.db-query';
import { getNavMenuCollectionsSchema } from './get-nav-menu-collections.schema';

export const getNavMenuCollectionsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, getUserContextMiddleware])
  .validator(getNavMenuCollectionsSchema)
  .handler(getNavMenuCollectionsDbQuery);
