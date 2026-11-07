import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { updateCollectionItemsDbQuery } from './update-collection-item-by-id.db-query';
import { updateCollectionItemsServerFnSchema } from './update-collection-item-by-id.schema';

export const updateCollectionItemsServerFn = createServerFn({
  // ? PUT is not yet supported via createServerFn, but the API route utilizes this via POST
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(updateCollectionItemsServerFnSchema)
  .handler(updateCollectionItemsDbQuery);
