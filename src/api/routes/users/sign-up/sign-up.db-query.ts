import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import {
  collectionItemsTable,
  collectionItemsToCustomFieldValuesTable,
  collectionsTable,
  collectionsToCustomFieldsTable,
  customFieldsTable,
  customFieldValuesTable,
} from '#/api/db/db-tables-schema';

export const createNewUserExampleRecordsDbQuery = async ({
  context,
}: DbQueryArgsDef<undefined>) => {
  const userId = context.user.id;

  db.transaction(async (tx) => {
    const [{ id: collectionId }] = await tx
      .insert(collectionsTable)
      .values({
        name: 'Example Collection',
        userId,
      })
      .returning({ id: collectionsTable.id });

    const [
      { id: customFieldTextId },
      { id: customFieldNumberId },
      { id: customFieldBooleanId },
    ] = await tx
      .insert(customFieldsTable)
      .values([
        {
          name: 'Example Text Field',
          userId,
          type: 'string',
        },
        {
          name: 'Example Number Field',
          userId,
          type: 'number',
        },
        {
          name: 'Example TRUE/FALSE Field',
          userId,
          type: 'boolean',
        },
      ])
      .returning({ id: customFieldsTable.id });

    await tx.insert(collectionsToCustomFieldsTable).values([
      {
        userId,
        collectionId,
        customFieldId: customFieldTextId,
      },
      {
        userId,
        collectionId,
        customFieldId: customFieldNumberId,
      },
      {
        userId,
        collectionId,
        customFieldId: customFieldBooleanId,
      },
    ]);

    const [{ id: collectionItemId }] = await tx
      .insert(collectionItemsTable)
      .values({
        name: 'Example Item',
        isSpecialEdition: true,
        collectionId,
        userId,
      })
      .returning({ id: collectionItemsTable.id });

    const customFieldValueIds = await tx
      .insert(customFieldValuesTable)
      .values([
        {
          customFieldId: customFieldTextId,
          valueText: 'Example Custom Field Value',
          userId,
        },
        {
          customFieldId: customFieldNumberId,
          userId,
          valueNumber: 123,
        },
        {
          customFieldId: customFieldBooleanId,
          valueBoolean: true,
          userId,
        },
      ])
      .returning({ id: customFieldValuesTable.id });

    await tx.insert(collectionItemsToCustomFieldValuesTable).values(
      customFieldValueIds.map(({ id }) => {
        return {
          userId,
          collectionItemId,
          customFieldValueId: id,
        };
      }),
    );
  });
};
