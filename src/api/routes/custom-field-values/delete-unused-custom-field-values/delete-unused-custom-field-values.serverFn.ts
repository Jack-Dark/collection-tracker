import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { deleteUnusedCustomFieldValuesDbQuery } from './delete-unused-custom-field-values.db-query';
import { deleteUnusedCustomFieldValuesSchema } from './delete-unused-custom-field-values.schema';

export const deleteUnusedCustomFieldValuesServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(deleteUnusedCustomFieldValuesSchema)
  .handler(deleteUnusedCustomFieldValuesDbQuery);
