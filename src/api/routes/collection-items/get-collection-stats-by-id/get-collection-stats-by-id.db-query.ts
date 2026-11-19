import { and, eq } from 'drizzle-orm';
import _ from 'lodash';

import type { CustomFieldTypeDef } from '#/api/db/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import { collectionItemsTable } from '#/api/db/db-tables-schema';

import type { GetCollectionStatsByIdRequestArgsDef } from './get-collection-stats-by-id.types';

import { formatCollection } from '../../collections/get-paginated-collections/get-paginated-collections.db-query';

export const getCollectionStatsByIdDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetCollectionStatsByIdRequestArgsDef>) => {
  const { collectionId } = data;

  const userId = context.user.id;

  return db.transaction(async (tx) => {
    const totalItems = await tx.$count(
      collectionItemsTable,
      and(
        eq(collectionItemsTable.collectionId, collectionId),
        eq(collectionItemsTable.userId, userId),
      ),
    );

    const limit = 10000;

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

    const customFieldsDataById = formattedCollection
      ? formattedCollection.customFields.reduce<
          Record<
            number,
            {
              name: string;
              order: number;
              type: CustomFieldTypeDef;
            }
          >
        >((acc, { id, ...rest }) => {
          return {
            ...acc,
            [id]: rest,
          };
        }, {})
      : {};

    const unformattedItems = await tx.query.collectionItems.findMany({
      columns: {},
      where: {
        AND: [
          {
            collectionId,
            userId,
          },
        ],
      },
      limit,
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

    const customFieldsDataByIdsAndValue =
      unformattedItems.reduce<CustomFieldDataByIdsAndValue>(
        (customFieldAcc, { customFieldValues }) => {
          return customFieldValues.reduce<CustomFieldDataByIdsAndValue>(
            (customFieldValueAcc, { customFieldValue }) => {
              if (customFieldValue) {
                const { customFieldId, valueBoolean, valueNumber, valueText } =
                  customFieldValue;
                const value = valueBoolean ?? valueNumber ?? valueText ?? '';
                const stringValue = String(value);

                const quantity =
                  customFieldValueAcc?.[customFieldId]?.items?.[stringValue]
                    ?.value || 0;

                return {
                  ...customFieldValueAcc,
                  [customFieldId]: {
                    items: {
                      ...customFieldValueAcc[customFieldId]?.items,
                      [stringValue]: {
                        value: quantity + 1,
                        label: stringValue,
                      },
                    },
                    id: customFieldId,
                    name: customFieldsDataById[customFieldId].name,
                    type: customFieldsDataById[customFieldId].type,
                    order: customFieldsDataById[customFieldId].order,
                  },
                } satisfies CustomFieldDataByIdsAndValue;
              } else {
                return customFieldValueAcc;
              }
            },
            customFieldAcc,
          );
        },
        {},
      );

    const formattedCustomFields = Object.values(
      customFieldsDataByIdsAndValue,
    ).reduce<FormattedCustomFieldData[]>((acc, { items, ...rest }) => {
      const sortedItems = _.sortBy(Object.values(items), ['label']);

      return [
        ...acc,
        { ...rest, items: sortedItems },
      ] satisfies FormattedCustomFieldData[];
    }, []);

    const sortedCustomFields = _.sortBy(formattedCustomFields, ['order']);

    return {
      name: formattedCollection?.name,
      customFields: sortedCustomFields,
      totalItems,
    };
  });
};

type CustomFieldDataByIdsAndValue = Record<
  number,
  Exclude<FormattedCustomFieldData, 'items'> & {
    items: Record<string, CustomFieldValueItemDef>;
  }
>;

type CustomFieldValueItemDef = {
  /** custom field value */
  label: string;
  /** quantity */
  value: number;
};

type FormattedCustomFieldData = {
  id: number;
  items: CustomFieldValueItemDef[];
  name: string;
  order: number;
  type: CustomFieldTypeDef;
};
