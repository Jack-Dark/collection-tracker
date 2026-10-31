import { eq, and } from 'drizzle-orm';
import _ from 'lodash';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import {
  collectionItemsToCustomFieldValuesTable,
  customFieldsTable,
  customFieldValuesTable,
} from '#/api/db-tables-schema';

import type { GetFiltersForCollectionRequestArgsDef } from './get-filters-for-collection.types';

export const getFiltersForCollectionDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetFiltersForCollectionRequestArgsDef>) => {
  const { id: collectionId } = data;

  const userId = context.user.id;

  return db.transaction(async (tx) => {
    const collection = await tx.query.collections.findFirst({
      columns: {},
      where: {
        id: collectionId,
        userId,
      },
      with: {
        customFields: {
          columns: {},
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

    if (!collection) {
      return [];
    }

    type CustomFieldData<TType extends CustomFieldTypeDef> = Omit<
      NonNullable<(typeof collection.customFields)[number]['customField']>,
      'type'
    > & { type: TType };

    const customFieldsInCollection = collection.customFields.reduce<
      CustomFieldData<CustomFieldTypeDef>[]
    >((acc, { customField }) => {
      if (customField) {
        return [...acc, customField];
      } else {
        return acc;
      }
    }, []);

    const uniqueCustomFieldValues = await Promise.all(
      customFieldsInCollection.map(async (customField) => {
        if (customField) {
          return await tx
            .selectDistinctOn([customFieldValuesTable.id], {
              valueBoolean: customFieldValuesTable.valueBoolean,
              valueNumber: customFieldValuesTable.valueNumber,
              valueText: customFieldValuesTable.valueText,
            })
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
              eq(customFieldsTable.id, customField.id),
            )
            .where(
              and(
                eq(customFieldsTable.userId, userId),
                eq(customFieldValuesTable.customFieldId, customField.id),
                eq(customFieldValuesTable.userId, userId),
              ),
            );
        } else {
          return;
        }
      }),
    );

    const formattedResponse = customFieldsInCollection.reduce<
      (
        | (CustomFieldData<'string'> & {
            items: {
              label: string;
              value: string;
            }[];
            range?: undefined;
          })
        | (CustomFieldData<'number'> & {
            items?: undefined;
            range: {
              max: number;
              min: number;
            };
          })
        | (CustomFieldData<'boolean'> & {
            items?: undefined;
            range?: undefined;
          })
      )[]
    >((acc, customField, index) => {
      if (customField.type === 'string') {
        const matchingCustomFieldValues = uniqueCustomFieldValues[index];

        if (matchingCustomFieldValues) {
          const values = matchingCustomFieldValues.map(({ valueText }) => {
            const value = valueText || '';

            return {
              label: value,
              value,
            };
          });

          const sortedValues = _.sortBy(values, ({ label }) => {
            return label.toLocaleLowerCase();
          });

          return [
            ...acc,
            {
              ...customField,
              items: sortedValues,
              type: customField.type,
            },
          ];
        }

        return acc;
      } else if (customField.type === 'number') {
        const matchingCustomFieldValues = uniqueCustomFieldValues[index];

        if (matchingCustomFieldValues) {
          // ? using reduce to exclude null in types
          const allNumberValues = matchingCustomFieldValues.reduce<number[]>(
            (acc, { valueNumber }) => {
              if (typeof valueNumber === 'number') {
                return [...acc, valueNumber];
              } else {
                return acc;
              }
            },
            [],
          );

          const uniqueCustomFieldValues = new Set(allNumberValues);

          // ? if there are at least 2 unique custom field values
          if (uniqueCustomFieldValues.size > 1) {
            const min = Math.floor(Math.min(...uniqueCustomFieldValues));
            const max = Math.ceil(Math.max(...uniqueCustomFieldValues));

            return [
              ...acc,
              {
                ...customField,
                range: {
                  max,
                  min,
                },
                type: customField.type,
              },
            ];
          }
        }
      } else if (customField.type === 'boolean') {
        return [
          ...acc,
          {
            ...customField,
            type: customField.type,
          },
        ];
      }

      return acc;
    }, []);

    return formattedResponse;
  });
};
