import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { createCollectionItemsDbQuery } from './create-collection-item.db-query';
import { createCollectionItemsServerFnSchema } from './create-collection-item.schema';

export const createCollectionItemServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(createCollectionItemsServerFnSchema)
  .handler(createCollectionItemsDbQuery);
