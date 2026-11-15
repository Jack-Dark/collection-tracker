import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';

import type { GetCustomFieldValuesByCustomFieldIdRequestArgsDef } from './get-custom-field-values-by-collection-id.types';

export const getCustomFieldValuesByCustomFieldIdDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetCustomFieldValuesByCustomFieldIdRequestArgsDef>) => {
  const { id } = data;
  const userId = context.user.id;

  return await db.query.customFieldValues.findMany({
    columns: {
      id: true,
      valueBoolean: true,
      valueNumber: true,
      valueText: true,
    },
    where: {
      customFieldId: id,
      userId,
    },
  });
};
