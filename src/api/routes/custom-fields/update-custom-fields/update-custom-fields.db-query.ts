import { and, eq } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import { customFieldsTable } from '#/api/db/db-tables-schema';
import { customFieldTypeLabelsMap } from '#/pages/CollectionsListPage/components/CollectionsListTable/components/column-cells/CollectionsListCustomFieldsCell/CollectionsListCustomFieldsCell.constants';

import type { UpdateCustomFieldsRequestArgsDef } from './update-custom-fields.types';

export const updateCustomFieldsDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<UpdateCustomFieldsRequestArgsDef>) => {
  const userId = context.user.id;
  const { records } = data;

  return db.transaction(async (tx) => {
    const matchingExistingCustomFields = await Promise.all(
      records.map(async ({ name, type }) => {
        const matchingRecord = await tx.query.customFields.findFirst({
          where: {
            name,
            type,
            userId,
          },
        });

        return matchingRecord;
      }),
    );

    for (const customField of matchingExistingCustomFields) {
      if (customField) {
        throw new Error(
          `Custom field "${customField.name} (${customFieldTypeLabelsMap[customField.type]})" already exists.`,
        );
      }
    }

    const updatedRecords = await Promise.all(
      records.map(async (record) => {
        const [updatedRecord] = await tx
          .update(customFieldsTable)
          .set({ ...record, userId })
          .where(
            and(
              eq(customFieldsTable.id, record.id),
              eq(customFieldsTable.userId, userId),
            ),
          )
          .returning();

        return updatedRecord;
      }),
    );

    return updatedRecords;
  });
};
