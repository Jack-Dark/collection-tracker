import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { createCollectionDbQuery } from './create-collection.db-query';
import { createCollectionServerFnSchema } from './create-collection.schema';

export const createCollectionServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(createCollectionServerFnSchema)
  .handler(createCollectionDbQuery);
