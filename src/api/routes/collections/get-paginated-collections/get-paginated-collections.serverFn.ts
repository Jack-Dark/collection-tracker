import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { getPaginatedCollectionsDbQuery } from './get-paginated-collections.db-query';
import { getPaginatedCollectionsSchema } from './get-paginated-collections.schema';

export const getPaginatedCollectionsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(getPaginatedCollectionsSchema)
  .handler(getPaginatedCollectionsDbQuery);
