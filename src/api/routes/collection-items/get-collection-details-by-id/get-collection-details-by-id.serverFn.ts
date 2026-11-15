import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { getCollectionDetailsByIdDbQuery } from './get-collection-details-by-id.db-query';
import { getCollectionDetailsByIdSchema } from './get-collection-details-by-id.schema';

export const getCollectionDetailsByIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(getCollectionDetailsByIdSchema)
  .handler(getCollectionDetailsByIdDbQuery);
