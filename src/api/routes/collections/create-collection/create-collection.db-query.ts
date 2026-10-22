import { eq } from 'drizzle-orm';

import type { InsertLinkCollectionsToCustomFieldsRecordDef } from '#/api/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import {
  collectionsTable,
  collectionsToCustomFieldsTable,
} from '#/api/db-tables-schema';

import type { CreateCollectionRequestArgsDef } from './create-collection.types';

export const createCollectionDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<CreateCollectionRequestArgsDef>) => {
  const { records } = data;

  if (!records || records.length === 0) {
    return;
  }

  const userId = context.user.id;
  const isAdmin = context.user.role === 'admin';

  return await db.transaction(async (tx) => {
    // ! temporarily cap the maximum allowed collections to avoid service fees
    const totalCollections = isAdmin
      ? 0
      : await tx.$count(collectionsTable, eq(collectionsTable.userId, userId));

    const maxAllowed = 20;
    const numAdditionalCollectionsAllowed = Math.max(
      0,
      maxAllowed - totalCollections,
    );

    if (!isAdmin && !numAdditionalCollectionsAllowed) {
      return {
        warning: `You have reached the maximum number of collections currently allowed for free (${maxAllowed}).`,
      };
    }

    for (const { customFields, ...record } of records) {
      // ? Create new collection records
      const [newCollectionRecord] = await tx
        .insert(collectionsTable)
        .values({ ...record, userId })
        .onConflictDoNothing()
        .returning();

      // ? Create brand new links between this collection and custom fields
      const newCollectionToCustomFieldRecords = customFields.reduce<
        InsertLinkCollectionsToCustomFieldsRecordDef[]
      >((acc, { customField, order }) => {
        return [
          ...acc,
          {
            collectionId: newCollectionRecord.id,
            customFieldId: customField.id,
            order,
            userId,
          },
        ];
      }, []);

      if (newCollectionToCustomFieldRecords.length) {
        await tx
          .insert(collectionsToCustomFieldsTable)
          .values(newCollectionToCustomFieldRecords);
      }
    }
  });
};
