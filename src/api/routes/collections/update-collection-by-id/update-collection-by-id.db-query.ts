import { and, eq, inArray, or } from 'drizzle-orm';
import z from 'zod';

import type { InsertLinkCollectionsToCustomFieldsRecordDef } from '#/api/db/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import {
  collectionsTable,
  collectionsToCustomFieldsTable,
} from '#/api/db/db-tables-schema';

import type { InsertCollectionRecordDef } from '../base-collection.schema';
import type { OnUpdateCollectionsArgsDef } from './update-collection-by-id.types';

import {
  buildConflictUpdateSetColumns,
  getDifferenceBetweenArrays,
} from '../../../helpers';

export const updateCollectionByIdDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<OnUpdateCollectionsArgsDef>) => {
  const { records: recordsToUpdate } = data;

  const userId = context.user.id;

  if (recordsToUpdate.length === 0) {
    return [];
  }

  const { collections, collectionsToCustomFieldsRecords } =
    recordsToUpdate.reduce<{
      collections: (Omit<
        OnUpdateCollectionsArgsDef['records'][number],
        'customFields'
      > & { userId: string })[];
      collectionsToCustomFieldsRecords: InsertLinkCollectionsToCustomFieldsRecordDef[];
    }>(
      (acc, { customFields, ...collection }) => {
        const collectionsToCustomFieldsRecords = Object.values(
          customFields,
        ).reduce<InsertLinkCollectionsToCustomFieldsRecordDef[]>(
          (acc, { customField, order }) => {
            if (customField) {
              return [
                ...acc,
                {
                  collectionId: collection.id,
                  customFieldId: customField.id,
                  order,
                  userId,
                } satisfies InsertLinkCollectionsToCustomFieldsRecordDef,
              ];
            } else {
              return acc;
            }
          },
          [],
        );

        return {
          collections: [
            ...acc.collections,
            { ...collection, userId },
          ] satisfies InsertCollectionRecordDef[],
          collectionsToCustomFieldsRecords: [
            ...acc.collectionsToCustomFieldsRecords,
            ...collectionsToCustomFieldsRecords,
          ] satisfies InsertLinkCollectionsToCustomFieldsRecordDef[],
        };
      },
      {
        collections: [],
        collectionsToCustomFieldsRecords: [],
      },
    );

  const collectionIds = collections.map(({ id }) => {
    return id;
  });

  await db.transaction(async (tx) => {
    // ? Upsert collection item records
    await tx
      .insert(collectionsTable)
      .values(collections)
      .onConflictDoUpdate({
        target: collectionsTable.id,
        set: buildConflictUpdateSetColumns(collectionsTable, {
          name: true,
          notes: true,
        }),
      });

    const existingJoinRecordsForCollectionItems = await tx
      .selectDistinctOn(
        [
          collectionsToCustomFieldsTable.collectionId,
          collectionsToCustomFieldsTable.customFieldId,
        ],
        {
          collectionId: collectionsToCustomFieldsTable.collectionId,
          customFieldId: collectionsToCustomFieldsTable.customFieldId,
        },
      )
      .from(collectionsToCustomFieldsTable)
      .where(
        inArray(collectionsToCustomFieldsTable.collectionId, collectionIds),
      );

    // ? Upsert collection item to custom field value records
    if (collectionsToCustomFieldsRecords.length) {
      await tx
        .insert(collectionsToCustomFieldsTable)
        .values(collectionsToCustomFieldsRecords)
        .onConflictDoNothing({
          target: [
            collectionsToCustomFieldsTable.collectionId,
            collectionsToCustomFieldsTable.customFieldId,
          ],
        });
    }

    const formattedLatestJoinRecordsForCollectionItems =
      collectionsToCustomFieldsRecords.map(
        ({ collectionId, customFieldId }) => {
          return {
            collectionId,
            customFieldId,
          };
        },
      );

    const recordsToDelete = getDifferenceBetweenArrays(
      existingJoinRecordsForCollectionItems,
      formattedLatestJoinRecordsForCollectionItems,
      z.object({
        collectionId: z.number().min(1),
        customFieldId: z.number().min(1),
      }),
    );

    if (recordsToDelete.length) {
      await tx.delete(collectionsToCustomFieldsTable).where(
        or(
          ...recordsToDelete.map(({ collectionId, customFieldId }) => {
            return and(
              eq(collectionsToCustomFieldsTable.collectionId, collectionId),
              eq(collectionsToCustomFieldsTable.customFieldId, customFieldId),
            );
          }),
        ),
      );
    }
  });
};
