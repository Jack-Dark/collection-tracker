import { and, eq, inArray } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db';
import { customFieldsTable } from '#/api/db-tables-schema';

import type { DeleteCustomFieldsRequestArgsDef } from './delete-custom-fields.types';

export const deleteCustomFieldsDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<DeleteCustomFieldsRequestArgsDef>) => {
  const { ids } = data;
  const userId = context.user.id;

  const matchesUserAndIds = and(
    eq(customFieldsTable.userId, userId),
    inArray(customFieldsTable.id, ids),
  );

  await db.delete(customFieldsTable).where(matchesUserAndIds);
};
