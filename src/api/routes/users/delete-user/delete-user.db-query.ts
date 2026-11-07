import type { TableTransactionDef } from '#/api/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth.types';

import type { DeleteUserRequestArgsDef } from './delete-user.types';

export const getUserImagesDbQuery = async <
  TTransaction extends TableTransactionDef,
>({
  context,
  tx,
}: DbQueryArgsDef<DeleteUserRequestArgsDef> & { tx: TTransaction }) => {
  const userId = context.user.id;

  const imagesToDelete = await tx.query.collectionItems.findMany({
    columns: {
      images: true,
    },
    where: {
      userId,
    },
  });

  const publicIdsToDelete = imagesToDelete.reduce<string[]>(
    (acc, { images }) => {
      return [...acc, ...images];
    },
    [],
  );

  return publicIdsToDelete;
};
