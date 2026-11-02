import { eq } from 'drizzle-orm';

import type { InsertLinkCollectionItemsToCustomFieldValuesRecordDef } from '#/api/db-tables-schema.types';
import type { CloudinaryTagsItem } from '#/lib/cloudinary';

import { db } from '#/api/db';
import { addCloudinaryTagsToPublicIds } from '#/lib/cloudinary';

import type { CustomFieldValuesByFieldId } from '../../custom-field-values/custom-field-values.types';
import type { InsertCollectionItemRecordDef } from '../collection-item.types';
import type { CreateCollectionItemsDbQueryArgsDef } from './create-collection-item.types';

import {
  collectionItemsTable,
  collectionItemsToCustomFieldValuesTable,
} from '../../../db-tables-schema';

export const createCollectionItemsDbQuery = async ({
  context,
  data,
}: CreateCollectionItemsDbQueryArgsDef) => {
  const { publicIds, records } = data;

  if (!records.length) {
    return;
  }

  const userId = context.user.id;

  return await db.transaction(async (tx) => {
    // ! cap the maximum allowed collection items to avoid service fees
    const userData = await tx.query.users.findFirst({
      columns: { maxCollectionItems: true },
      where: { id: userId },
    });

    if (!userData) {
      throw new Error('Unable to locate user.');
    }

    const { maxCollectionItems } = userData;

    const maxReachedWarningMessage = `You have reached the maximum number of collection items currently allowed for free (${maxCollectionItems}).`;
    const totalCollections = await tx.$count(
      collectionItemsTable,
      eq(collectionItemsTable.userId, userId),
    );

    const numAdditionalCollectionsAllowed = Math.max(
      0,
      maxCollectionItems - totalCollections,
    );

    if (!numAdditionalCollectionsAllowed) {
      return {
        warning: maxReachedWarningMessage,
      };
    }

    const recordsToCreate =
      numAdditionalCollectionsAllowed < records.length
        ? records.slice(0, numAdditionalCollectionsAllowed)
        : records;

    const customFieldValuesIndexedToRecord: CustomFieldValuesByFieldId[] = [];

    const formattedCollectionItemRecords = recordsToCreate.map(
      ({ customFieldValues, ...record }, index) => {
        customFieldValuesIndexedToRecord.push(customFieldValues);

        return {
          ...record,
          images: publicIds[index],
          userId,
        } satisfies InsertCollectionItemRecordDef;
      },
    );

    // ? create new collection items
    const newCollectionItemRecords = await tx
      .insert(collectionItemsTable)
      .values(formattedCollectionItemRecords)
      .onConflictDoNothing()
      .returning();

    // ? Create links between the collection items and custom field values
    const collectionItemsToCustomFieldValues =
      customFieldValuesIndexedToRecord.reduce<
        InsertLinkCollectionItemsToCustomFieldValuesRecordDef[]
      >((acc, customFieldValues, index) => {
        const collectionItem = newCollectionItemRecords[index];

        const customFieldValuesForCollectionItem = Object.values(
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

        return [...acc, ...customFieldValuesForCollectionItem];
      }, []);

    if (collectionItemsToCustomFieldValues.length) {
      await tx
        .insert(collectionItemsToCustomFieldValuesTable)
        .values(collectionItemsToCustomFieldValues);
    }

    const cloudinaryTagItems = newCollectionItemRecords.map(
      ({ collectionId, id: collectionItemId, userId }, index) => {
        const publicIdsForRecord = publicIds[index];

        return {
          collectionId,
          collectionItemId,
          publicIds: publicIdsForRecord,
          userId,
        } satisfies CloudinaryTagsItem;
      },
    );

    await addCloudinaryTagsToPublicIds(...cloudinaryTagItems);

    if (numAdditionalCollectionsAllowed < records.length) {
      return {
        warning: maxReachedWarningMessage,
      };
    }
  });
};
