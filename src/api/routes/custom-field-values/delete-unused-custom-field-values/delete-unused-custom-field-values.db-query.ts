import { and, eq, notExists, sql } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db';
import {
  collectionItemsToCustomFieldValuesTable,
  customFieldValuesTable,
} from '#/api/db-tables-schema';

import type { DeleteUnusedCustomFieldValuesRequestArgsDef } from './delete-unused-custom-field-values.types';

export const deleteUnusedCustomFieldValuesDbQuery = async ({
  context,
}: DbQueryArgsDef<DeleteUnusedCustomFieldValuesRequestArgsDef>) => {
  const userId = context.user.id;

  await db.transaction(async (tx) => {
    await tx.delete(customFieldValuesTable).where(
      and(
        eq(customFieldValuesTable.userId, userId),
        notExists(
          tx
            .select({ exists: sql<boolean>`1` })
            .from(collectionItemsToCustomFieldValuesTable)
            .where(
              eq(
                collectionItemsToCustomFieldValuesTable.customFieldValueId,
                customFieldValuesTable.id,
              ),
            ),
        ),
      ),
    );
  });
};
