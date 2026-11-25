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
import _ from 'lodash';

import type { CustomFieldTypeDef } from '#/api/db/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import {
  collectionItemsTable,
  collectionItemsToCustomFieldValuesTable,
  customFieldsTable,
  customFieldValuesTable,
} from '#/api/db/db-tables-schema';
import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { getPaginationMetadataQuery } from '#/api/pagination/pagination.query';
import { articlesToIgnore } from '#/pages/CollectionDetailsPage/components/CollectionDetailsTable/hooks/use-collection-details-settings-props/hooks/use-ignore-sort-articles';

import type { CollectionItemsTableColumn } from '../../collection-items/collection-item.types';
import type {
  CustomFieldValueDef,
  CustomFieldValuesByFieldId,
} from '../../custom-field-values/custom-field-values.types';
import type { GetCollectionDetailsByIdRequestArgsDef } from './get-collection-details-by-id.types';

import { formatCollection } from '../get-paginated-collections/get-paginated-collections.db-query';

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

  const fallbackSortField: CollectionItemsTableColumn =
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

    const formattedCollection = collection && formatCollection(collection);

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
        const { rangeMax, rangeMin } = filter;

        if (rangeMin !== undefined && rangeMax !== undefined) {
          return [
            ...acc,
            getWhereCustomFieldValuesMatch({
              asExists: true,
              customFieldId,
              tx,
              where: between(
                customFieldValuesTable.valueNumber,
                rangeMin,
                rangeMax,
              ),
            }),
          ];
        }
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

    const trimmedQuery = search.trim();
    const ilikeQuery = `%${trimmedQuery}%`;
    const searchSql = trimmedQuery
      ? searchNotes
        ? ilike(collectionItemsTable.notes, ilikeQuery)
        : ilike(collectionItemsTable.name, ilikeQuery)
      : undefined;

    const offset = (page - 1) * limit;

    const { orderBySql: fallbackOrderBy } = getFormattedOrderBy({
      column: collectionItemsTable[fallbackSortField],
      direction: sort.direction,
      ignoreSortArticles,
    });

    const {
      orderBySql: orderByCollectionItemNameSql,
      selectDistinctOnColumn: selectDistinctCollectionItemName,
    } = getFormattedOrderBy({
      column: collectionItemsTable.name,
      direction:
        sortDirectionOptions.asc /* ? enforce asc sorting as this is only used when sorting by custom field value
       */,
      ignoreSortArticles,
    });

    const customFieldValueSortColumn = getCustomFieldValueSortColumn(
      sort.data?.customField?.type,
    );

    const {
      orderBySql: orderByCustomFieldValue,
      selectDistinctOnColumn: selectDistinctOnCustomFieldValue,
    } = customFieldValueSortColumn
      ? getFormattedOrderBy({
          column: customFieldValueSortColumn,
          direction: sort.direction,
          ignoreSortArticles,
        })
      : {};

    const unformattedCollectionItemIds =
      selectDistinctOnCustomFieldValue && orderByCustomFieldValue
        ? await tx
            .selectDistinctOn(
              [
                collectionItemsTable.id,
                selectDistinctOnCustomFieldValue,
                selectDistinctCollectionItemName,
              ],
              {
                id: collectionItemsTable.id,
                name: collectionItemsTable.name,
                // ! all orderBy SQL is required to be included for selectDistinctOn to function
                orderByCustomFieldValue,
                orderByCollectionItemNameSql,
              },
            )
            .from(collectionItemsTable)
            .innerJoin(
              collectionItemsToCustomFieldValuesTable,
              eq(
                collectionItemsTable.id,
                collectionItemsToCustomFieldValuesTable.collectionItemId,
              ),
            )
            .innerJoin(
              customFieldValuesTable,
              and(
                eq(
                  collectionItemsToCustomFieldValuesTable.customFieldValueId,
                  customFieldValuesTable.id,
                ),
                sort.data?.customField &&
                  eq(
                    customFieldValuesTable.customFieldId,
                    sort.data.customField.id,
                  ),
              ),
            )
            .where(
              and(
                eq(collectionItemsTable.collectionId, collectionId),
                eq(collectionItemsTable.userId, userId),
                searchSql,
                ...formattedFiltersSql,
              ),
            )
            .orderBy(orderByCustomFieldValue, orderByCollectionItemNameSql)
            .limit(limit)
            .offset(offset)
        : await tx
            .select({
              id: collectionItemsTable.id,
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
            .orderBy(fallbackOrderBy)
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
      where: {
        AND: [
          {
            collectionId,
            id: {
              in: formattedCollectionItemIds,
            },
            userId,
          },
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
                  [customFieldId]: rest as CustomFieldValueDef,
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

    const customFieldValueColumnName = getCustomFieldValueSortColumnName(
      sort.data?.customField?.type,
    );

    const sortedItems = _.orderBy(
      formattedItems,
      (item) => {
        if (
          // ? if sorting by custom field value
          sort.data?.customField &&
          customFieldValueColumnName
        ) {
          const customFieldValueForCustomFieldId =
            item.customFieldValues[sort.data.customField.id]?.[
              customFieldValueColumnName
            ];

          return [customFieldValueForCustomFieldId, item.name];
        } else if (sort.field === 'createdAt' || sort.field === 'updatedAt') {
          // ? if sorting by date

          const timestamp = item[sort.field];
          const dateAsMs = new Date(timestamp).getTime();

          return [dateAsMs, item.name];
        } else if (
          // ? if sorting by something other than name
          collectionItemsTable.hasOwnProperty(sort.field) &&
          sort.field !== 'name'
        ) {
          const columnName = sort.field as keyof typeof item;

          return [item[columnName], item.name];
        } else {
          // ? sort by name

          return [item.name];
        }
      },
      [
        sort.direction,
        // ? if second sort criteria (always 'name'), always sort ascending
        'asc',
      ],
    );

    const lastUpdatedCollectionItem = await tx.query.collectionItems.findFirst({
      columns: {},
      with: {
        customFieldValues: {
          columns: {},
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
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const lastUpdatedCustomFieldValues =
      lastUpdatedCollectionItem?.customFieldValues || [];

    const lastAddedCustomFieldValuesByCustomFieldId =
      lastUpdatedCustomFieldValues.reduce<CustomFieldValuesByFieldId>(
        (acc, customField) => {
          if (customField?.customFieldValue) {
            const { customFieldId, ...rest } = customField.customFieldValue;

            return {
              ...acc,
              [customFieldId]: rest as CustomFieldValueDef,
            };
          }

          return acc;
        },
        {},
      );

    return {
      collection: formattedCollection,
      items: sortedItems,
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

const getCustomFieldValueSortColumnName = (
  customFieldType: CustomFieldTypeDef | undefined,
) => {
  switch (customFieldType) {
    case 'boolean':
      return 'valueBoolean' satisfies keyof typeof customFieldValuesTable;

    case 'number':
      return 'valueNumber' satisfies keyof typeof customFieldValuesTable;

    case 'string':
      return 'valueText' satisfies keyof typeof customFieldValuesTable;

    default:
      break;
  }
};
const getCustomFieldValueSortColumn = (
  customFieldType: CustomFieldTypeDef | undefined,
) => {
  const columnName = getCustomFieldValueSortColumnName(customFieldType);

  if (columnName) {
    switch (customFieldType) {
      case 'boolean':
        return customFieldValuesTable.valueBoolean;

      case 'number':
        return customFieldValuesTable.valueNumber;

      case 'string':
        return customFieldValuesTable.valueText;

      default:
        break;
    }
  }
};

const getFormattedOrderBy = (props: {
  column: PgColumn;
  direction: 'asc' | 'desc';
  ignoreSortArticles: boolean;
}) => {
  const { column, direction, ignoreSortArticles } = props;

  const directionFn = direction === sortDirectionOptions.desc ? desc : asc;

  const selectDistinctOnColumn =
    column.dataType === 'string'
      ? ignoreSortArticles
        ? sql`REGEXP_REPLACE(lower(${column}), '^(${sql.raw(articlesToIgnore.join('|'))})\\s+', '', 'i')`
        : sql`lower(${column})`
      : sql`${column}`;

  const orderBySql = directionFn(selectDistinctOnColumn);

  return {
    /** Same as `formattedColumn`, but with the sort direction applied. */
    orderBySql,
    /** Should be passed to the `selectDistinctOn` array. */
    selectDistinctOnColumn,
  };
};
