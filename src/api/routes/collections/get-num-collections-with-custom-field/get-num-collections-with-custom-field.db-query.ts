import { and, eq } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import { collectionsToCustomFieldsTable } from '#/api/db/db-tables-schema';

import type { GetNumCollectionsWithCustomFieldRequestArgsDef } from './get-num-collections-with-custom-field.types';

export const getNumCollectionsWithCustomFieldDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetNumCollectionsWithCustomFieldRequestArgsDef>) => {
  const { customFieldId } = data;
  const userId = context.user.id;

  const numAffectedCollections = await db.$count(
    collectionsToCustomFieldsTable,
    and(
      eq(collectionsToCustomFieldsTable.userId, userId),
      eq(collectionsToCustomFieldsTable.customFieldId, customFieldId),
    ),
  );

  return { numAffectedCollections };
};
