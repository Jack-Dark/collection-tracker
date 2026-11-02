import z from 'zod';

import { getRequiredPaginationQueriesSchema } from '#/api/pagination/pagination.schema';

import type { CollectionTableColumnsDef } from '../collection.types';

export const getPaginatedCollectionsSchema = z.object({
  params: getRequiredPaginationQueriesSchema<CollectionTableColumnsDef>('name'),
});

export const collectionsListSearchQueriesSchema =
  getRequiredPaginationQueriesSchema<CollectionTableColumnsDef>('name').and(
    z.object({
      searchNotes: z
        .boolean()
        .default(false),
    }),
  );
