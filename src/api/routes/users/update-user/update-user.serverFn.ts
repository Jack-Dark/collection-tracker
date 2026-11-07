import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireUserContextMiddleware } from '#/api/middleware/require-user-context-middleware';

import { updateUserDbQuery } from './update-user.db-query';
import { updateUserSchema } from './update-user.schema';

export const updateUserServerFn = createServerFn({
  method: 'POST',
})
  .middleware([errorHandlingMiddleware, requireUserContextMiddleware])
  .validator(updateUserSchema)
  .handler(updateUserDbQuery);
