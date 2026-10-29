import { and, eq, inArray } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import { collectionsToCustomFieldsTable } from '#/api/db-tables-schema';

import type { GetCollectionsWithCustomFieldsRequestArgsDef } from './get-collections-with-custom-field.types';

export const getCollectionsWithCustomFieldsDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetCollectionsWithCustomFieldsRequestArgsDef>) => {
  const { customFieldIds } = data;
  const userId = context.user.id;

  const totalRecords = await db.$count(
    collectionsToCustomFieldsTable,
    and(
      eq(collectionsToCustomFieldsTable.userId, userId),
      inArray(collectionsToCustomFieldsTable.customFieldId, customFieldIds),
    ),
  );

  return totalRecords;
};
