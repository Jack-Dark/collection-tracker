import { defineRelations } from 'drizzle-orm';

import * as schema from '../db/db-tables-schema';

export const relations = defineRelations(
  {
    accounts: schema.accountsTable,
    collectionItems: schema.collectionItemsTable,
    collectionItemsToCustomFieldValues:
      schema.collectionItemsToCustomFieldValuesTable,
    collections: schema.collectionsTable,
    collectionsToCustomFields: schema.collectionsToCustomFieldsTable,
    customFields: schema.customFieldsTable,
    customFieldValues: schema.customFieldValuesTable,
    sessions: schema.sessionsTable,
    users: schema.usersTable,
    verifications: schema.verificationsTable,
  },
  (r) => {
    return {
      accounts: {
        user: r.one.users({
          from: r.accounts.userId,
          to: r.users.id,
        }),
      },
      collectionItems: {
        collectionItemsToCustomFieldValues:
          r.many.collectionItemsToCustomFieldValues(),
      },
      collectionItemsToCustomFieldValues: {
        collectionItem: r.one.collectionItems({
          from: r.collectionItemsToCustomFieldValues.collectionItemId,
          to: r.collectionItems.id,
        }),
        customFieldValue: r.one.customFieldValues({
          from: r.collectionItemsToCustomFieldValues.customFieldValueId,
          to: r.customFieldValues.id,
        }),
        user: r.one.users({
          from: r.collectionItemsToCustomFieldValues.userId,
          to: r.users.id,
        }),
      },
      collections: {
        collectionsToCustomFields: r.many.collectionsToCustomFields(),
        user: r.one.users({
          alias: 'collections_userId_users_id',
          from: r.collections.userId,
          to: r.users.id,
        }),
        users: r.many.users({
          alias: 'collections_id_users_id_via_collectionItems',
          from: r.collections.id.through(r.collectionItems.collectionId),
          to: r.users.id.through(r.collectionItems.userId),
        }),
      },
      collectionsToCustomFields: {
        collection: r.one.collections({
          from: r.collectionsToCustomFields.collectionId,
          to: r.collections.id,
        }),
        customField: r.one.customFields({
          from: r.collectionsToCustomFields.customFieldId,
          to: r.customFields.id,
        }),
        user: r.one.users({
          from: r.collectionsToCustomFields.userId,
          to: r.users.id,
        }),
      },
      customFields: {
        collectionsToCustomFields: r.many.collectionsToCustomFields(),
        user: r.one.users({
          alias: 'customFields_userId_users_id',
          from: r.customFields.userId,
          to: r.users.id,
        }),
        users: r.many.users({
          alias: 'customFields_id_users_id_via_customFieldValues',
          from: r.customFields.id.through(r.customFieldValues.customFieldId),
          to: r.users.id.through(r.customFieldValues.userId),
        }),
      },
      customFieldValues: {
        collectionItemsToCustomFieldValues:
          r.many.collectionItemsToCustomFieldValues(),
      },
      sessions: {
        user: r.one.users({
          from: r.sessions.userId,
          to: r.users.id,
        }),
      },
      users: {
        accounts: r.many.accounts(),
        collectionItemsToCustomFieldValues:
          r.many.collectionItemsToCustomFieldValues(),
        collectionsToCustomFields: r.many.collectionsToCustomFields(),
        collectionsUserId: r.many.collections({
          alias: 'collections_userId_users_id',
        }),
        collectionsViaCollectionItems: r.many.collections({
          alias: 'collections_id_users_id_via_collectionItems',
        }),
        customFieldsUserId: r.many.customFields({
          alias: 'customFields_userId_users_id',
        }),
        customFieldsViaCustomFieldValues: r.many.customFields({
          alias: 'customFields_id_users_id_via_customFieldValues',
        }),
        sessions: r.many.sessions(),
      },
    };
  },
);
