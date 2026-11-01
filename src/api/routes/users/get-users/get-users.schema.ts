import { getOptionalPaginationQueriesSchema } from '#/api/pagination/pagination.schema';

export const getUsersRequestSchema =
  getOptionalPaginationQueriesSchema('email');
