import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { createCustomFieldValuesDbQuery } from './create-custom-field-value.db-query';
import { createCustomFieldValuesSchema } from './create-custom-field-value.schema';

export const createCustomFieldValuesServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(createCustomFieldValuesSchema)
  .handler(createCustomFieldValuesDbQuery);
