import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { getCollectionItemsWithCustomFieldValueDbQuery } from './get-collection-items-with-custom-field-value.db-query';
import { getCollectionItemsWithCustomFieldValueSchema } from './get-collection-items-with-custom-field-value.schema';

export const getCollectionItemsWithCustomFieldValueServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(getCollectionItemsWithCustomFieldValueSchema)
  .handler(getCollectionItemsWithCustomFieldValueDbQuery);
