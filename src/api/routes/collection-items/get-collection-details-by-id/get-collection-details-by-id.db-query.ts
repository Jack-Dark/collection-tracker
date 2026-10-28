import type { AnyRelations, SQL } from 'drizzle-orm';
import type { NeonQueryResultHKT } from 'drizzle-orm/neon-serverless';
import type { PgAsyncTransaction, PgColumn } from 'drizzle-orm/pg-core';

import {
  and,
  eq,
  ilike,
  inArray,
  sql,
  asc,
  desc,
  exists,
  between,
  notExists,
} from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import {
  collectionItemsTable,
  collectionItemsToCustomFieldValuesTable,
  customFieldsTable,
  customFieldValuesTable,
} from '#/api/db-tables-schema';
import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { getPaginationMetadataQuery } from '#/api/pagination/pagination.query';
import { articlesToIgnore } from '#/pages/CollectionDetailsPage/components/CollectionDetailsTable/hooks/use-collection-details-settings-props/hooks/use-ignore-sort-articles';

import type { CustomFieldValuesByFieldId } from '../../custom-field-values/custom-field-values.types';
import type { CollectionItemsTableColumn } from '../collection-item.types';
import type { GetCollectionDetailsByIdRequestArgsDef } from './get-collection-details-by-id.types';

export const getCollectionDetailsByIdDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetCollectionDetailsByIdRequestArgsDef>) => {
  const { collectionId, params } = data;
  const {
    filters,
    ignoreSortArticles,
    limit,
    page,
    search,
    searchNotes,
    sort,
  } = params;

  const userId = context.user.id;

  const sortingField: CollectionItemsTableColumn =
    sort.field && collectionItemsTable.hasOwnProperty(sort.field)
      ? (sort.field as CollectionItemsTableColumn)
      : 'name';

  return db.transaction(async (tx) => {
    const totalRecords = await tx.$count(
      collectionItemsTable,
      and(
        eq(collectionItemsTable.collectionId, collectionId),
        eq(collectionItemsTable.userId, userId),
      ),
    );

    const pagination = getPaginationMetadataQuery({
      currentPage: page,
      pageSize: limit,
      totalRecords,
    });

    const collection = await tx.query.collections.findFirst({
      columns: {
        id: true,
        name: true,
      },
      where: {
        id: collectionId,
        userId,
      },
      with: {
        customFields: {
          columns: {
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
          with: {
            customField: {
              columns: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    const formattedFiltersSql = Object.entries(filters).reduce<
      (SQL | undefined)[]
    >((acc, [customFieldIdString, filter]) => {
      const customFieldId = Number(customFieldIdString);

      if (filter.type === 'string') {
        const { items } = filter;
        if (items.length) {
          return [
            ...acc,
            getWhereCustomFieldValuesMatch({
              asExists: true,
              customFieldId,
              tx,
              where: inArray(customFieldValuesTable.valueText, items),
            }),
          ];
        }
      } else if (filter.type === 'number') {
        const { range } = filter;
        const { max, min } = range;

        return [
          ...acc,
          getWhereCustomFieldValuesMatch({
            asExists: true,
            customFieldId,
            tx,
            where: between(customFieldValuesTable.valueNumber, min, max),
          }),
        ];
      } else if (filter.type === 'boolean') {
        const { value } = filter;
        if (value === true) {
          // ? check if `true` exists

          return [
            ...acc,
            getWhereCustomFieldValuesMatch({
              asExists: true,
              customFieldId,
              tx,
              where: eq(customFieldValuesTable.valueBoolean, true),
            }),
          ];
        } else if (value === false) {
          // ? check if `true` does not exist as `false` and `null` are presented the same way and `null` values do not have a linking table record

          return [
            ...acc,
            getWhereCustomFieldValuesMatch({
              asExists: false,
              customFieldId,
              tx,
              where: eq(customFieldValuesTable.valueBoolean, true),
            }),
          ];
        }
      }

      return acc;
    }, []);

    const getOrderBy = (column: PgColumn) => {
      const directionFn =
        sort.direction === sortDirectionOptions.desc ? desc : asc;

      return directionFn(
        column.dataType === 'string'
          ? ignoreSortArticles
            ? sql`REGEXP_REPLACE(lower(${column}), '^(${sql.raw(articlesToIgnore.join('|'))})\\s+', '', 'i')`
            : sql`lower(${column})`
          : sql`${column}`,
      );
    };

    const trimmedQuery = search.trim();
    const ilikeQuery = `%${trimmedQuery}%`;
    const searchSql = trimmedQuery
      ? searchNotes
        ? ilike(collectionItemsTable.notes, ilikeQuery)
        : ilike(collectionItemsTable.name, ilikeQuery)
      : undefined;

    const orderBySql = getOrderBy(
      collectionItemsTable[sortingField] || collectionItemsTable.name,
    );
    const offset = (page - 1) * limit;

    const unformattedCollectionItemIds = await tx
      .selectDistinct({
        id: collectionItemsTable.id,
        // ! orderBySql is required to be included for selectDistinct to function
        orderBySql,
      })
      .from(collectionItemsTable)
      .where(
        and(
          eq(collectionItemsTable.collectionId, collectionId),
          eq(collectionItemsTable.userId, userId),
          searchSql,
          ...formattedFiltersSql,
        ),
      )
      .orderBy(orderBySql)
      .limit(limit)
      .offset(offset);

    const formattedCollectionItemIds = unformattedCollectionItemIds.map(
      ({ id }) => {
        return id;
      },
    );

    const unformattedItems = await tx.query.collectionItems.findMany({
      columns: {
        userId: false,
      },
      orderBy: (table) => {
        return getOrderBy(table[sortingField || 'name']);
      },
      where: {
        AND: [
          {
            collectionId,
            id: {
              in: formattedCollectionItemIds,
            },
            userId,
          },
          trimmedQuery
            ? searchNotes
              ? {
                  notes: {
                    ilike: ilikeQuery,
                  },
                }
              : {
                  name: {
                    ilike: ilikeQuery,
                  },
                }
            : {},
        ],
      },
      with: {
        customFieldValues: {
          columns: {},
          with: {
            customFieldValue: {
              columns: {
                customFieldId: true,
                id: true,
                valueBoolean: true,
                valueNumber: true,
                valueText: true,
              },
            },
          },
        },
      },
    });

    const formattedItems = unformattedItems.map(
      ({ customFieldValues, ...item }) => {
        const customFieldValuesByCustomFieldId =
          customFieldValues.reduce<CustomFieldValuesByFieldId>(
            (acc, { customFieldValue }) => {
              if (customFieldValue) {
                const { customFieldId, ...rest } = customFieldValue;

                return {
                  ...acc,
                  [customFieldId]: rest,
                };
              }

              return acc;
            },
            {},
          );

        return {
          ...item,
          customFieldValues: customFieldValuesByCustomFieldId,
        };
      },
    );

    const customFieldIds =
      collection?.customFields.reduce<number[]>((acc, { customField }) => {
        if (customField?.id) {
          return [...acc, customField.id];
        } else {
          return acc;
        }
      }, []) || [];

    const lastAddedCustomFieldValues = await Promise.all(
      customFieldIds.map(async (customFieldId) => {
        return tx.query.collectionItemsToCustomFieldValues.findFirst({
          columns: {},
          orderBy: {
            updatedAt: 'desc',
          },
          where: {
            customFieldValue: {
              customFieldId,
            },
            collectionItem: {
              collectionId,
            },
          },
          with: {
            customFieldValue: {
              columns: {
                id: true,
                customFieldId: true,
                valueBoolean: true,
                valueNumber: true,
                valueText: true,
              },
            },
          },
        });
      }),
    );

    const lastAddedCustomFieldValuesByCustomFieldId =
      lastAddedCustomFieldValues.reduce<CustomFieldValuesByFieldId>(
        (acc, customField) => {
          if (customField?.customFieldValue) {
            const { customFieldId, ...rest } = customField.customFieldValue;

            return {
              ...acc,
              [customFieldId]: rest,
            };
          }

          return acc;
        },
        {},
      );

    return {
      collection,
      items: formattedItems,
      lastAddedCustomFieldValues: lastAddedCustomFieldValuesByCustomFieldId,
      pagination,
    };
  });
};

const getWhereCustomFieldValuesMatch = <
  TRelations extends AnyRelations,
>(props: {
  asExists: boolean;
  customFieldId: number;
  tx: PgAsyncTransaction<NeonQueryResultHKT, TRelations>;
  where: SQL;
}) => {
  const { asExists, customFieldId, tx, where } = props;

  const fn = asExists ? exists : notExists;

  return fn(
    tx
      .select({ exists: sql<boolean>`1` })
      .from(collectionItemsToCustomFieldValuesTable)
      .innerJoin(
        customFieldValuesTable,
        eq(
          customFieldValuesTable.id,
          collectionItemsToCustomFieldValuesTable.customFieldValueId,
        ),
      )
      .innerJoin(
        customFieldsTable,
        eq(customFieldsTable.id, customFieldValuesTable.customFieldId),
      )
      .where(
        and(
          eq(
            collectionItemsTable.id,
            collectionItemsToCustomFieldValuesTable.collectionItemId,
          ),
          eq(customFieldsTable.id, customFieldId),
          where,
        ),
      ),
  );
};
