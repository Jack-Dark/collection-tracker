import { and, eq, ilike } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import { getPaginationMetadataQuery } from '#/api/pagination/pagination.query';

import type { CollectionRecordDef } from '../collection.types';
import type { GetPaginatedCollectionsRequestArgsDef } from './get-paginated-collections.types';

import { collectionsTable } from '../../../db-tables-schema';

export const getPaginatedCollectionsDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetPaginatedCollectionsRequestArgsDef>) => {
  const { params } = data;
  const { limit, page, search, sort } = params;

  const userId = context.user.id;

  return db.transaction(async (tx) => {
    const matchesUserAndSearch = and(
      eq(collectionsTable.userId, userId),
      search
        ? ilike(collectionsTable.name, `%${search.toLowerCase()}%`)
        : undefined,
    );

    const totalRecords = await tx.$count(
      collectionsTable,
      matchesUserAndSearch,
    );

    const pagination = getPaginationMetadataQuery({
      currentPage: page,
      pageSize: limit,
      totalRecords,
    });

    const sortFieldParam = sort?.field;
    const sortingField =
      sortFieldParam && collectionsTable.hasOwnProperty(sortFieldParam)
        ? (sortFieldParam as keyof CollectionRecordDef)
        : 'name';

    const collections = await tx.query.collections.findMany({
      columns: {
        userId: false,
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: {
        [sortingField]: sort?.direction || 'asc',
      },
      where: {
        name: {
          ilike: `%${search.toLowerCase()}%`,
        },
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

    return {
      collections,
      pagination,
    };
  });
};
