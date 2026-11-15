import { and, eq } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import {
  collectionItemsTable,
  collectionItemsToCustomFieldValuesTable,
  collectionsTable,
} from '#/api/db/db-tables-schema';

import type { GetCollectionItemsWithCustomFieldValueRequestArgsDef } from './get-collection-items-with-custom-field-value.types';

export const getCollectionItemsWithCustomFieldValueDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetCollectionItemsWithCustomFieldValueRequestArgsDef>) => {
  const { customFieldValueId } = data;

  const userId = context.user.id;

  return db.transaction(async (tx) => {
    const numAffectedCollectionItems: number = await tx.$count(
      collectionItemsToCustomFieldValuesTable,
      and(
        eq(
          collectionItemsToCustomFieldValuesTable.customFieldValueId,
          customFieldValueId,
        ),
        eq(collectionItemsToCustomFieldValuesTable.userId, userId),
      ),
    );

    const affectedCollections = await tx
      .selectDistinct({
        id: collectionsTable.id,
        name: collectionsTable.name,
      })
      .from(collectionsTable)
      .innerJoin(
        collectionItemsTable,
        eq(collectionsTable.id, collectionItemsTable.collectionId),
      )
      .innerJoin(
        collectionItemsToCustomFieldValuesTable,
        eq(
          collectionItemsTable.id,
          collectionItemsToCustomFieldValuesTable.collectionItemId,
        ),
      )
      .where(
        and(
          eq(collectionsTable.userId, userId),
          eq(
            collectionItemsToCustomFieldValuesTable.customFieldValueId,
            customFieldValueId,
          ),
        ),
      );

    return {
      affectedCollections,
      numAffectedCollectionItems,
    };
  });
};
