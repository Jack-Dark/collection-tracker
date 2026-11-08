import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import { customFieldsTable } from '#/api/db/db-tables-schema';
import { customFieldTypeLabelsMap } from '#/pages/CollectionsListPage/components/CollectionsListTable/components/column-cells/CollectionsListCustomFieldsCell/CollectionsListCustomFieldsCell.constants';

import type { CreateCustomFieldsRequestArgsDef } from './create-custom-fields.types';

export const createCustomFieldsDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<CreateCustomFieldsRequestArgsDef>) => {
  const { records } = data;
  const userId = context.user.id;

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
        const typeLabel = customFieldTypeLabelsMap[customField.type];

        throw new Error(
          `Custom field "${customField.name} (${typeLabel})" already exists.`,
        );
      }
    }

    const formattedRecords = records.map((record) => {
      return { ...record, userId };
    });

    const newRecords = await tx
      .insert(customFieldsTable)
      .values(formattedRecords)
      .onConflictDoNothing()
      .returning();

    return newRecords;
  });
};
