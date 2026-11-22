import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { getCollectionStatsByIdDbQuery } from './get-collection-stats-by-id.db-query';
import { getCollectionStatsByIdSchema } from './get-collection-stats-by-id.schema';

export const getCollectionStatsByIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(getCollectionStatsByIdSchema)
  .handler(getCollectionStatsByIdDbQuery);
