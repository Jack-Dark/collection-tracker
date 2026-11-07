import { and, asc, eq, sql } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth.types';

import { db } from '#/api/db';

import type { GetNavMenuCollectionsRequestArgsDef } from './get-nav-menu-collections.types';

import { collectionsTable } from '../../../db-tables-schema';

export const getNavMenuCollectionsDbQuery = async ({
  context,
}: DbQueryArgsDef<GetNavMenuCollectionsRequestArgsDef>) => {
  const userId = context.user.id;

  if (!userId) {
    return { collections: [] };
  }

  const collections = await db
    .select({ id: collectionsTable.id, name: collectionsTable.name })
    .from(collectionsTable)
    .where(and(eq(collectionsTable.userId, userId)))
    .orderBy(asc(sql`lower(${collectionsTable.name})`));

  return { collections };
};
