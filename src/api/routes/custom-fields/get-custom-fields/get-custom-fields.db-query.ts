import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import { getPaginationQueryDefaults } from '#/api/pagination/pagination.schema';

import type { GetCustomFieldsRequestArgsDef } from './get-custom-fields.types';

export const getCustomFieldsDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetCustomFieldsRequestArgsDef>) => {
  const userId = context.user.id;
  const { ids = [], params } = data;
  const { limit, page, search, sort } =
    params || getPaginationQueryDefaults('name');

  const customFields = await db.query.customFields.findMany({
    columns: {
      id: true,
      name: true,
      type: true,
    },
    limit,
    offset: (page - 1) * limit,
    orderBy: {
      [sort.field]: sort.direction,
    },
    where: {
      id: ids.length
        ? {
            in: ids,
          }
        : undefined,
      name: {
        ilike: `%${search}%`,
      },
      userId,
    },
  });

  return customFields;
};
