import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { deleteCustomFieldsDbQuery } from './delete-custom-fields.db-query';
import { deleteCustomFieldsSchema } from './delete-custom-fields.schema';

export const deleteCustomFieldsServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(deleteCustomFieldsSchema)
  .handler(deleteCustomFieldsDbQuery);
