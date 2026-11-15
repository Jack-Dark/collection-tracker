import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { deleteCollectionDbQuery } from './delete-collection-by-id.db-query';
import { deleteCollectionsByIdsSchema } from './delete-collection-by-id.schema';

export const deleteCollectionByIdServerFn = createServerFn({
  // ? DELETE is not yet supported via createServerFn, but the API route utilizes this via DELETE
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(deleteCollectionsByIdsSchema)
  .handler(deleteCollectionDbQuery);
