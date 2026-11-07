import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { getNumCollectionsWithCustomFieldDbQuery } from './get-num-collections-with-custom-field.db-query';
import { getNumCollectionsWithCustomFieldSchema } from './get-num-collections-with-custom-field.schema';

export const getNumCollectionsWithCustomFieldServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(getNumCollectionsWithCustomFieldSchema)
  .handler(getNumCollectionsWithCustomFieldDbQuery);
