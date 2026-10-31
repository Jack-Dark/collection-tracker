import { eq } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import { usersTable } from '#/api/db-tables-schema';

import type { UpdateUserRequestArgsDef } from './update-user.types';

export const updateUserDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<UpdateUserRequestArgsDef>) => {
  const userId = context.user.id;

  await db
    .update(usersTable)
    .set({ name: data.name })
    .where(eq(usersTable.id, userId));
};
