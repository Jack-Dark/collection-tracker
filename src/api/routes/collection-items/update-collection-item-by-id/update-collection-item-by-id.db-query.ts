import { and, eq, inArray, or, sql } from 'drizzle-orm';
import { z } from 'zod';

import type { InsertLinkCollectionItemsToCustomFieldValuesRecordDef } from '#/api/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';
import type { CloudinaryTagsItem } from '#/lib/cloudinary';

import { db } from '#/api/db';
import {
  collectionItemsTable,
  collectionItemsToCustomFieldValuesTable,
} from '#/api/db-tables-schema';
import {
  buildConflictUpdateSetColumns,
  getDifferenceBetweenArrays,
} from '#/api/helpers';
import {
  addCloudinaryTagsToPublicIds,
  deleteCloudinaryAssetsByPublicIds,
} from '#/lib/cloudinary';

import type { InsertCollectionItemRecordDef } from '../collection-item.types';
import type { UpdateCollectionItemsRequestArgsDef } from './update-collection-item-by-id.types';

export const updateCollectionItemsDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<UpdateCollectionItemsRequestArgsDef>) => {
  const { records: collectionItemRecords, uploadedPublicIds } = data;
  if (collectionItemRecords.length === 0) {
    return;
  }

  const userId = context.user.id;

  const collectionItemIds = collectionItemRecords.map(({ id }) => {
    return id;
  });

  await db.transaction(async (tx) => {
    // ? Get all old images to track which ones the user deleted
    // ! Perform first, before records are altered
    const existingImagesRecords = await tx
      .select({ images: collectionItemsTable.images })
      .from(collectionItemsTable)
      .where(
        and(
          inArray(collectionItemsTable.id, collectionItemIds),
          eq(collectionItemsTable.userId, userId),
          sql`json_array_length(${collectionItemsTable.images}) > 0`,
        ),
      );

    // ? Save list of user deleted public IDs for removal
    const userDeletedPublicIds = existingImagesRecords.reduce<string[]>(
      (acc, { images: existingImages }, index) => {
        const deletedPublicIds = existingImages.filter((existingPublicId) => {
          const imageWasKept =
            uploadedPublicIds[index].includes(existingPublicId);

          return !imageWasKept;
        });

        return [...acc, ...deletedPublicIds];
      },
      [],
    );

    const { collectionItems, collectionItemToCustomFieldValueRecords } =
      collectionItemRecords.reduce<{
        collectionItems: InsertCollectionItemRecordDef[];
        collectionItemToCustomFieldValueRecords: InsertLinkCollectionItemsToCustomFieldValuesRecordDef[];
      }>(
        (acc, { customFieldValues, ...collectionItem }) => {
          const collectionItemToCustomFieldValueRecords = Object.values(
            customFieldValues,
          ).reduce<InsertLinkCollectionItemsToCustomFieldValuesRecordDef[]>(
            (acc, customFieldValue) => {
              if (customFieldValue) {
                return [
                  ...acc,
                  {
                    collectionItemId: collectionItem.id,
                    customFieldValueId: customFieldValue.id,
                    userId,
                  } satisfies InsertLinkCollectionItemsToCustomFieldValuesRecordDef,
                ];
              } else {
                return acc;
              }
            },
            [],
          );

          return {
            collectionItems: [
              ...acc.collectionItems,
              { ...collectionItem, userId },
            ] satisfies InsertCollectionItemRecordDef[],
            collectionItemToCustomFieldValueRecords: [
              ...acc.collectionItemToCustomFieldValueRecords,
              ...collectionItemToCustomFieldValueRecords,
            ] satisfies InsertLinkCollectionItemsToCustomFieldValuesRecordDef[],
          };
        },
        {
          collectionItems: [],
          collectionItemToCustomFieldValueRecords: [],
        },
      );

    // ? Upsert collection item records
    await tx
      .insert(collectionItemsTable)
      .values(collectionItems)
      .onConflictDoUpdate({
        target: collectionItemsTable.id,
        set: buildConflictUpdateSetColumns(collectionItemsTable, {
          editionDetails: true,
          images: true,
          isSpecialEdition: true,
          name: true,
          notes: true,
        }),
      });

    const existingJoinRecordsForCollectionItems = await tx
      .selectDistinctOn(
        [
          collectionItemsToCustomFieldValuesTable.collectionItemId,
          collectionItemsToCustomFieldValuesTable.customFieldValueId,
        ],
        {
          collectionItemId:
            collectionItemsToCustomFieldValuesTable.collectionItemId,
          customFieldValueId:
            collectionItemsToCustomFieldValuesTable.customFieldValueId,
        },
      )
      .from(collectionItemsToCustomFieldValuesTable)
      .where(
        inArray(
          collectionItemsToCustomFieldValuesTable.collectionItemId,
          collectionItemIds,
        ),
      );

    // ? Upsert collection item to custom field value records
    if (collectionItemToCustomFieldValueRecords.length) {
      await tx
        .insert(collectionItemsToCustomFieldValuesTable)
        .values(collectionItemToCustomFieldValueRecords)
        .onConflictDoNothing({
          target: [
            collectionItemsToCustomFieldValuesTable.collectionItemId,
            collectionItemsToCustomFieldValuesTable.customFieldValueId,
          ],
        });
    }

    const formattedLatestJoinRecordsForCollectionItems =
      collectionItemToCustomFieldValueRecords.map(
        ({ collectionItemId, customFieldValueId }) => {
          return {
            collectionItemId,
            customFieldValueId,
          };
        },
      );

    const recordsToDelete = getDifferenceBetweenArrays(
      existingJoinRecordsForCollectionItems,
      formattedLatestJoinRecordsForCollectionItems,
      z.object({
        collectionItemId: z.number().min(1),
        customFieldValueId: z.number().min(1),
      }),
    );

    if (recordsToDelete.length) {
      await tx.delete(collectionItemsToCustomFieldValuesTable).where(
        or(
          ...recordsToDelete.map(({ collectionItemId, customFieldValueId }) => {
            return and(
              eq(
                collectionItemsToCustomFieldValuesTable.collectionItemId,
                collectionItemId,
              ),
              eq(
                collectionItemsToCustomFieldValuesTable.customFieldValueId,
                customFieldValueId,
              ),
            );
          }),
        ),
      );
    }

    const cloudinaryTagItems = collectionItemRecords.map(
      ({ collectionId, id: collectionItemId }, index) => {
        const publicIdsForRecord = uploadedPublicIds[index];

        return {
          collectionId,
          collectionItemId,
          publicIds: publicIdsForRecord,
          userId,
        } satisfies CloudinaryTagsItem;
      },
    );

    // ? add tags to the new images on the collection item
    await addCloudinaryTagsToPublicIds(...cloudinaryTagItems);

    // ? Remove images deleted by the user, if any
    // ! Perform last just in case there is an error earlier
    await deleteCloudinaryAssetsByPublicIds(...userDeletedPublicIds);
  });
};
