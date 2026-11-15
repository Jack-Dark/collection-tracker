import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { getCustomFieldValuesByCustomFieldIdDbQuery } from './get-custom-field-values-by-collection-id.db-query';
import { getCustomFieldValuesByCustomFieldIdSchema } from './get-custom-field-values-by-collection-id.schema';

export const getCustomFieldValuesByCustomFieldIdServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(getCustomFieldValuesByCustomFieldIdSchema)
  .handler(getCustomFieldValuesByCustomFieldIdDbQuery);
