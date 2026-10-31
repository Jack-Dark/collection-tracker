import type { SQL } from 'drizzle-orm';

import { and, eq } from 'drizzle-orm';

import type { InsertCustomFieldValueRecordDef } from '#/api/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import { customFieldValuesTable } from '#/api/db-tables-schema';

import type { CreateCustomFieldValuesRequestArgsDef } from './create-custom-field-value.types';

export const createCustomFieldValuesDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<CreateCustomFieldValuesRequestArgsDef>) => {
  const { records } = data;

  const userId = context.user.id;

  return db.transaction(async (tx) => {
    const formattedCustomFieldValues = records.map(({ value, ...rest }) => {
      switch (typeof value) {
        case 'boolean': {
          return {
            ...rest,
            userId,
            valueBoolean: value,
            valueNumber: null,
            valueText: null,
          } satisfies InsertCustomFieldValueRecordDef;
        }

        case 'number': {
          return {
            ...rest,
            userId,
            valueBoolean: null,
            valueNumber: value,
            valueText: null,
          } satisfies InsertCustomFieldValueRecordDef;
        }

        default:
          return {
            ...rest,
            userId,
            valueBoolean: null,
            valueNumber: null,
            valueText: value,
          } satisfies InsertCustomFieldValueRecordDef;
      }
    });

    const newRecords = await Promise.all(
      formattedCustomFieldValues.map(async (record) => {
        const valueEqStatements: SQL[] = [];

        if (record.valueBoolean !== null) {
          valueEqStatements.push(
            eq(customFieldValuesTable.valueBoolean, record.valueBoolean),
          );
        } else if (record.valueNumber !== null) {
          valueEqStatements.push(
            eq(customFieldValuesTable.valueNumber, record.valueNumber),
          );
        } else if (record.valueText !== null) {
          valueEqStatements.push(
            eq(customFieldValuesTable.valueText, record.valueText),
          );
        }

        const [existingCustomFieldValueRecord] = await tx
          .select({
            id: customFieldValuesTable.id,
            valueBoolean: customFieldValuesTable.valueBoolean,
            valueNumber: customFieldValuesTable.valueNumber,
            valueText: customFieldValuesTable.valueText,
          })
          .from(customFieldValuesTable)
          .where(
            and(
              eq(customFieldValuesTable.customFieldId, record.customFieldId),
              eq(customFieldValuesTable.userId, record.userId),
              ...valueEqStatements,
            ),
          );

        if (existingCustomFieldValueRecord) {
          return existingCustomFieldValueRecord;
        } else {
          const [newRecord] = await tx
            .insert(customFieldValuesTable)
            .values(formattedCustomFieldValues)
            .onConflictDoNothing()
            .returning({
              id: customFieldValuesTable.id,
              valueBoolean: customFieldValuesTable.valueBoolean,
              valueNumber: customFieldValuesTable.valueNumber,
              valueText: customFieldValuesTable.valueText,
            });

          return newRecord;
        }
      }),
    );

    return newRecords;
  });
};
