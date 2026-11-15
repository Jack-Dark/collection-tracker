import { and, eq } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import {
  collectionItemsToCustomFieldValuesTable,
  customFieldValuesTable,
} from '#/api/db/db-tables-schema';

import type { DeleteCustomFieldValuesRequestArgsDef } from './delete-custom-field-values.types';

export const deleteCustomFieldValuesDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<DeleteCustomFieldValuesRequestArgsDef>) => {
  const { collectionItemId, ids } = data;
  const userId = context.user.id;

  return db.transaction(async (tx) => {
    const deleteCustomFieldValueRecord = (customFieldValueId: number) => {
      return db
        .delete(customFieldValuesTable)
        .where(
          and(
            eq(customFieldValuesTable.id, customFieldValueId),
            eq(customFieldValuesTable.userId, userId),
          ),
        );
    };

    const collectionItemExistsInDb = typeof collectionItemId === 'number';

    await Promise.all(
      ids.map(async (customFieldValueId) => {
        if (collectionItemExistsInDb) {
          // ? get the number of links between this custom field and all collection items
          const numMatchingLinks = await tx.$count(
            collectionItemsToCustomFieldValuesTable,
            and(
              eq(
                collectionItemsToCustomFieldValuesTable.customFieldValueId,
                customFieldValueId,
              ),
              eq(collectionItemsToCustomFieldValuesTable.userId, userId),
            ),
          );

          if (numMatchingLinks > 1) {
            // ? if custom field value is linked to multiple collection items, delete only the link for this collection item id
            return db
              .delete(customFieldValuesTable)
              .where(
                and(
                  eq(
                    collectionItemsToCustomFieldValuesTable.collectionItemId,
                    collectionItemId,
                  ),
                  eq(
                    collectionItemsToCustomFieldValuesTable.customFieldValueId,
                    customFieldValueId,
                  ),
                  eq(collectionItemsToCustomFieldValuesTable.userId, userId),
                ),
              );
          } else {
            // ? otherwise delete the custom field value record which automatically deletes all its links
            return deleteCustomFieldValueRecord(customFieldValueId);
          }
        } else {
          return deleteCustomFieldValueRecord(customFieldValueId);
        }
      }),
    );
  });
};
