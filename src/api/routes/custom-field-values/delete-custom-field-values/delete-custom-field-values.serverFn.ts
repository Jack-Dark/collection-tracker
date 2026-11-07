import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { deleteCustomFieldValuesDbQuery } from './delete-custom-field-values.db-query';
import { deleteCustomFieldValuesSchema } from './delete-custom-field-values.schema';

export const deleteCustomFieldValuesServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(deleteCustomFieldValuesSchema)
  .handler(deleteCustomFieldValuesDbQuery);
