import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { getCustomFieldsDbQuery } from './get-custom-fields.db-query';
import { getCustomFieldsSchema } from './get-custom-fields.schema';

export const getCustomFieldsServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(getCustomFieldsSchema)
  .handler(getCustomFieldsDbQuery);
