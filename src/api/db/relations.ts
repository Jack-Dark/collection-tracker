import { defineRelations } from 'drizzle-orm';

import * as schema from './db-tables-schema';

// ? keys prefixed with `a_` are aliases
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
    times: schema.timestamps,
    users: schema.usersTable,
    verifications: schema.verificationsTable,
  },
  (r) => {
    return {
      collectionItems: {
        customFieldValues: r.many.collectionItemsToCustomFieldValues({
          from: r.collectionItems.id,
          to: r.collectionItemsToCustomFieldValues.collectionItemId,
        }),
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
      },
      collections: {
        collectionItems: r.many.collectionItems({
          from: r.collections.id,
          to: r.collectionItems.collectionId,
        }),
        customFields: r.many.collectionsToCustomFields({
          from: r.collections.id,
          to: r.collectionsToCustomFields.collectionId,
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
      },
      customFields: {
        collections: r.many.collectionsToCustomFields({
          from: r.customFields.id,
          to: r.collectionsToCustomFields.customFieldId,
        }),
        customFieldValues: r.many.customFieldValues({
          from: r.customFields.id,
          to: r.customFieldValues.customFieldId,
        }),
      },
      customFieldValues: {
        collectionItems: r.many.collectionItemsToCustomFieldValues({
          from: r.customFieldValues.id,
          to: r.collectionItemsToCustomFieldValues.customFieldValueId,
        }),
      },
      users: {
        accounts: r.one.accounts({
          from: r.users.id,
          to: r.accounts.userId,
        }),
        collectionItems: r.many.collectionItems({
          from: r.users.id,
          to: r.collectionItems.userId,
        }),
        collections: r.many.collections({
          from: r.users.id,
          to: r.collections.userId,
        }),
        customFields: r.many.customFields({
          from: r.users.id,
          to: r.customFields.userId,
        }),
        customFieldValues: r.many.customFieldValues({
          from: r.users.id,
          to: r.customFieldValues.userId,
        }),
        sessions: r.many.sessions({
          from: r.users.id,
          to: r.sessions.userId,
        }),
      },
    };
  },
);
