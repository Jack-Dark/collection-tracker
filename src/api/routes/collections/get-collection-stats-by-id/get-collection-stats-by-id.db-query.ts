import { and, eq } from 'drizzle-orm';
import _ from 'lodash';

import type { CustomFieldTypeDef } from '#/api/db/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import { collectionItemsTable } from '#/api/db/db-tables-schema';

import type { GetCollectionStatsByIdRequestArgsDef } from './get-collection-stats-by-id.types';

import { formatCollection } from '../get-paginated-collections/get-paginated-collections.db-query';

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
      columns: {
        isSpecialEdition: true,
      },
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

                if (value === false) {
                  return customFieldValueAcc;
                }

                const stringValue =
                  typeof value === 'boolean'
                    ? getBooleanLabel(value)
                    : String(value);

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
                    name: customFieldsDataById[customFieldId]?.name,
                    type: customFieldsDataById[customFieldId]?.type,
                    order: customFieldsDataById[customFieldId]?.order,
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

    const formattedCustomFields = Object.values(customFieldsDataByIdsAndValue)
      .reduce<FormattedCustomFieldData[]>((acc, { items, ...rest }) => {
        const isNumberType = rest.type === 'number';
        const itemsArray = Object.values(items);
        const sortedItems = _.sortBy(itemsArray, ({ label }) => {
          return isNumberType ? Number(label) : label;
        });

        return [
          ...acc,
          { ...rest, items: sortedItems },
        ] satisfies FormattedCustomFieldData[];
      }, [])
      .map((data) => {
        if (data.type === 'boolean') {
          // ? create `false` item based on `true` quantity
          const trueLabel = getBooleanLabel(true);
          const trueItem: CustomFieldValueItemDef = data.items.find((item) => {
            return item.label === trueLabel;
          }) || {
            label: trueLabel,
            value: 0,
          };

          const formattedBooleanItems = [
            trueItem,
            {
              label: getBooleanLabel(false),
              value: totalItems - trueItem.value,
            },
          ] satisfies CustomFieldValueItemDef[];

          return { ...data, items: formattedBooleanItems };
        } else {
          return data;
        }
      });

    const sortedCustomFields = _.sortBy(formattedCustomFields, ['order']);

    const trueLabel = getBooleanLabel(true);
    const falseLabel = getBooleanLabel(false);
    const isSpecialEditionByLabel = unformattedItems.reduce<
      Record<string, CustomFieldValueItemDef>
    >(
      (acc, { isSpecialEdition }) => {
        const label = getBooleanLabel(isSpecialEdition);

        const currentQuantity = acc[label].value;

        return {
          ...acc,
          [label]: {
            label,
            value: currentQuantity + 1,
          } satisfies CustomFieldValueItemDef,
        };
      },
      {
        [trueLabel]: {
          value: 0,
          label: trueLabel,
        },
        [falseLabel]: {
          value: 0,
          label: falseLabel,
        },
      },
    );

    return {
      name: formattedCollection?.name,
      customFields: sortedCustomFields,
      /** Indexes are in this order: `[trueItem, falseItem]` */
      isSpecialEditionItems: [
        isSpecialEditionByLabel[trueLabel],
        isSpecialEditionByLabel[falseLabel],
      ] satisfies [CustomFieldValueItemDef, CustomFieldValueItemDef],
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
  label: string;
  /** Quantity */
  value: number;
};

type FormattedCustomFieldData = {
  id: number;
  /** If `type === 'boolean'`, the array contains 2 indexes in this order: `[trueItem, falseItem]` */
  items: CustomFieldValueItemDef[];
  name: string;
  order: number;
  type: CustomFieldTypeDef;
};

export const getBooleanLabel = (boolean: boolean) => {
  return boolean ? 'Yes' : 'No';
};
