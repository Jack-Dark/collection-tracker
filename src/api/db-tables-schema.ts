import {
  text,
  timestamp,
  boolean,
  serial,
  json,
  snakeCase,
  integer,
  numeric,
} from 'drizzle-orm/pg-core';

import type { UserRoleDef } from '#/auth/auth-middleware.types';

import { userRoles } from '#/auth/auth-middleware.schema';

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

export const usersTable = snakeCase.table('users', {
  banExpires: timestamp('ban_expires'),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  id: text('id').primaryKey(),
  image: text('image'),
  maxCollectionItems: integer('max_collection_items').notNull().default(250),
  maxCollections: integer('max_collections').notNull().default(20),
  name: text('name').notNull(),
  role: text('role').$type<UserRoleDef>().notNull().default(userRoles.user),
  ...timestamps,
});

export const sessionsTable = snakeCase.table('sessions', {
  expiresAt: timestamp('expires_at').notNull(),
  id: text('id').primaryKey(),
  impersonatedBy: text('impersonated_by'),
  ipAddress: text('ip_address'),
  token: text('token').notNull().unique(),
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
});

export const accountsTable = snakeCase.table('accounts', {
  accessToken: text('access_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  accountId: text('account_id').notNull(),
  id: text('id').primaryKey(),
  idToken: text('id_token'),
  password: text('password'),
  providerId: text('provider_id').notNull(),
  refreshToken: text('refresh_token'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
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

export const verificationsTable = snakeCase.table('verifications', {
  expiresAt: timestamp('expires_at').notNull(),
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  ...timestamps,
});

export const collectionsTable = snakeCase.table('collections', {
  id: serial().primaryKey(),
  name: text().notNull(),
  notes: text().notNull().default(''),
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

export const collectionItemsTable = snakeCase.table('collection_items', {
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
  images: json().$type<string[]>().default([]).notNull(),
  isSpecialEdition: boolean('is_special_edition').notNull(),
  name: text().notNull(),
  notes: text().default('').notNull(),
  userId: text('user_id')
    .default('')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    ),
  ...timestamps,
});

export const customFieldsTable = snakeCase.table('custom_fields', {
  id: serial().primaryKey(),
  name: text().notNull(),
  type: text().$type<CustomFieldTypeDef>().notNull(),
  userId: text()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    )
    .notNull(),
  ...timestamps,
});

export const customFieldValuesTable = snakeCase.table('custom_field_values', {
  customFieldId: integer()
    .references(
      () => {
        return customFieldsTable.id;
      },
      { onDelete: 'cascade' },
    )
    .notNull(),
  id: serial().primaryKey(),
  userId: text()
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'cascade' },
    )
    .notNull(),
  valueBoolean: boolean(),
  valueNumber: numeric({ mode: 'number' }),
  valueText: text(),
  ...timestamps,
});

export const collectionsToCustomFieldsTable = snakeCase.table(
  'collections_to_custom_fields',
  {
    collectionId: integer()
      .notNull()
      .references(
        () => {
          return collectionsTable.id;
        },
        { onDelete: 'cascade' },
      ),
    customFieldId: integer()
      .notNull()
      .references(
        () => {
          return customFieldsTable.id;
        },
        { onDelete: 'cascade' },
      ),
    id: serial().primaryKey(),
    order: integer().notNull().default(0),
    userId: text()
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
    ...timestamps,
  },
);

export const collectionItemsToCustomFieldValuesTable = snakeCase.table(
  'collection_items_to_custom_field_values',
  {
    collectionItemId: integer()
      .notNull()
      .references(
        () => {
          return collectionItemsTable.id;
        },
        { onDelete: 'cascade' },
      ),
    customFieldValueId: integer()
      .notNull()
      .references(
        () => {
          return customFieldValuesTable.id;
        },
        { onDelete: 'cascade' },
      ),
    id: serial().primaryKey(),
    userId: text()
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: 'cascade' },
      ),
    ...timestamps,
  },
);
