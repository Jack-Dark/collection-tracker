import { createServerFn } from '@tanstack/react-start';

import { errorHandlingMiddleware } from '#/api/middleware/error-handling-middleware';
import { requireAdminUserContextMiddleware } from '#/api/middleware/require-admin-user-context-middleware';

import { getUsersDbQuery } from './get-users.db-query';
import { getUsersRequestSchema } from './get-users.schema';

export const getUsersServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, requireAdminUserContextMiddleware])
  .validator(getUsersRequestSchema)
  .handler(getUsersDbQuery);
