import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { createCustomFieldsDbQuery } from './create-custom-fields.db-query';
import { createCustomFieldsSchema } from './create-custom-fields.schema';

export const createCustomFieldsServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(createCustomFieldsSchema)
  .handler(createCustomFieldsDbQuery);
