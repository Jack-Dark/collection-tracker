import { and, eq, inArray } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db/db';
import { collectionsTable } from '#/api/db/db-tables-schema';
import { deleteCloudinaryAssetsByPublicIds } from '#/lib/cloudinary';

import type { DeleteCollectionByIdRequestArgsDef } from './delete-collection-by-id.types';

export const deleteCollectionDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<DeleteCollectionByIdRequestArgsDef>) => {
  const { ids } = data;

  const userId = context.user.id;

  await db.transaction(async (tx) => {
    const imagesToDelete = await tx.query.collectionItems.findMany({
      columns: {
        images: true,
      },
      where: {
        collectionId: {
          in: ids,
        },
      },
    });

    const publicIdsToDelete = imagesToDelete.reduce<string[]>(
      (acc, { images }) => {
        return [...acc, ...images];
      },
      [],
    );

    // ? Delete collections
    await tx
      .delete(collectionsTable)
      .where(
        and(
          inArray(collectionsTable.id, ids),
          eq(collectionsTable.userId, userId),
        ),
      );

    await deleteCloudinaryAssetsByPublicIds(...publicIdsToDelete);
  });
};
