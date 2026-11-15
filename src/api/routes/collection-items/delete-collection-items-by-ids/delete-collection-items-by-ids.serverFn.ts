import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { deleteCollectionItemsByIdsDbQuery } from './delete-collection-items-by-ids.db-query';
import { deleteCollectionItemsByIdsSchema } from './delete-collection-items-by-ids.schema';

export const deleteCollectionItemsByIdsServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via POST
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(deleteCollectionItemsByIdsSchema)
  .handler(deleteCollectionItemsByIdsDbQuery);
