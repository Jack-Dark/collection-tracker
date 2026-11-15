import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { updateCustomFieldsDbQuery } from './update-custom-fields.db-query';
import { updateCustomFieldsSchema } from './update-custom-fields.schema';

export const updateCustomFieldsServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(updateCustomFieldsSchema)
  .handler(updateCustomFieldsDbQuery);
