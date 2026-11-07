import {
  text,
  timestamp,
  boolean,
  serial,
  json,
  integer,
  numeric,
  primaryKey,
  pgTable,
  unique,
} from 'drizzle-orm/pg-core';

import type { UserRoleDef } from '#/auth/auth.types';

import { userRoles } from '#/auth/auth.constants';

import type { CustomFieldTypeDef } from './db-tables-schema.types';

export const timestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => {
      return new Date();
    })
    .notNull(),
};

export const accountsTable = pgTable('accounts', {
  accessToken: text('access_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  accountId: text('account_id').notNull(),
  id: text().primaryKey(),
  idToken: text('id_token'),
  password: text(),
  providerId: text('provider_id').notNull(),
  refreshToken: text('refresh_token'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text(),
  userId: text('user_id')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    ),
  ...timestamps,
});

export const collectionItemsTable = pgTable('collection_items', {
  collectionId: serial('collection_id')
    .notNull()
    .references(
      () => {
        return collectionsTable.id;
      },
      { onDelete: 'cascade' },
    ),
  editionDetails: text('edition_details').default('').notNull(),
  id: serial().primaryKey(),
  images: json().default([]).notNull(),
  isSpecialEdition: boolean('is_special_edition').default(false).notNull(),
  name: text().notNull(),
  notes: text().default('').notNull(),
  userId: text('user_id')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    ),
  ...timestamps,
});

export const collectionItemsToCustomFieldValuesTable = pgTable(
  'collection_items_to_custom_field_values',
  {
    collectionItemId: integer('collection_item_id')
      .notNull()
      .references(
        () => {
          return collectionItemsTable.id;
        },
        { onDelete: 'cascade' },
      ),
    customFieldValueId: integer('custom_field_value_id')
      .notNull()
      .references(
        () => {
          return customFieldValuesTable.id;
        },
        { onDelete: 'cascade' },
      ),
    userId: text('user_id')
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
    ...timestamps,
  },
  (table) => {
    return [
      primaryKey({
        columns: [table.collectionItemId, table.customFieldValueId],
        name: 'collection_items_to_custom_field_values_pkey',
      }),
    ];
  },
);

export const collectionsTable = pgTable('collections', {
  id: serial().primaryKey(),
  name: text().notNull(),
  notes: text().default('').notNull(),
  userId: text('user_id')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    ),
  ...timestamps,
});

export const collectionsToCustomFieldsTable = pgTable(
  'collections_to_custom_fields',
  {
    collectionId: integer('collection_id')
      .notNull()
      .references(
        () => {
          return collectionsTable.id;
        },
        { onDelete: 'cascade' },
      ),
    customFieldId: integer('custom_field_id')
      .notNull()
      .references(
        () => {
          return customFieldsTable.id;
        },
        { onDelete: 'cascade' },
      ),
    order: integer().default(0).notNull(),
    userId: text('user_id')
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
    ...timestamps,
  },
  (table) => {
    return [
      primaryKey({
        columns: [table.collectionId, table.customFieldId],
        name: 'collections_to_custom_fields_pkey',
      }),
    ];
  },
);

export const customFieldValuesTable = pgTable('custom_field_values', {
  customFieldId: integer('custom_field_id')
    .notNull()
    .references(
      () => {
        return customFieldsTable.id;
      },
      { onDelete: 'cascade' },
    ),
  id: serial().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    ),
  valueBoolean: boolean('value_boolean'),
  valueNumber: numeric('value_number'),
  valueText: text('value_text'),
  ...timestamps,
});

export const customFieldsTable = pgTable('custom_fields', {
  id: serial().primaryKey(),
  name: text().notNull(),
  type: text().$type<CustomFieldTypeDef>().notNull(),
  userId: text('user_id')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    ),
  ...timestamps,
});

export const sessionsTable = pgTable(
  'sessions',
  {
    expiresAt: timestamp('expires_at').notNull(),
    id: text().primaryKey(),
    impersonatedBy: text('impersonated_by'),
    ipAddress: text('ip_address'),
    token: text().notNull(),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
    ...timestamps,
  },
  (table) => {
    return [unique('sessions_token_unique').on(table.token)];
  },
);

export const usersTable = pgTable(
  'users',
  {
    banExpires: timestamp('ban_expires'),
    banned: boolean(),
    banReason: text('ban_reason'),
    email: text().notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    id: text().primaryKey(),
    image: text(),
    maxCollectionItems: integer('max_collection_items').default(250).notNull(),
    maxCollections: integer('max_collections').default(20).notNull(),
    name: text().notNull(),
    role: text().$type<UserRoleDef>().default(userRoles.user).notNull(),
    ...timestamps,
  },
  (table) => {
    return [unique('users_email_unique').on(table.email)];
  },
);

export const verificationsTable = pgTable('verifications', {
  expiresAt: timestamp('expires_at').notNull(),
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  ...timestamps,
});
