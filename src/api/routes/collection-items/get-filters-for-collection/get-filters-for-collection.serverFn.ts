import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { getFiltersForCollectionDbQuery } from './get-filters-for-collection.db-query';
import { getFiltersForCollectionSchema } from './get-filters-for-collection.schema';

export const getFiltersForCollectionServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(getFiltersForCollectionSchema)
  .handler(getFiltersForCollectionDbQuery);
