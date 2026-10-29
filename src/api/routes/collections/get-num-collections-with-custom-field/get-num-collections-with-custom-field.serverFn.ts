import { createServerFn } from '@tanstack/react-start';

import {
  authApiRouteMiddleware,
  errorHandlingMiddleware,
} from '#/auth/auth-middleware';

import { getNumCollectionsWithCustomFieldDbQuery } from './get-num-collections-with-custom-field.db-query';
import { getNumCollectionsWithCustomFieldSchema } from './get-num-collections-with-custom-field.schema';

export const getNumCollectionsWithCustomFieldServerFn = createServerFn({
  method: 'GET',
})
  .middleware([errorHandlingMiddleware, authApiRouteMiddleware])
  .validator(getNumCollectionsWithCustomFieldSchema)
  .handler(getNumCollectionsWithCustomFieldDbQuery);
