import z from 'zod';

import type { CollectionItemsTableColumn } from '../collection-item.types';

import { getRequiredPaginationQueriesSchema } from '../../../pagination/pagination.schema';

export const collectionDetailsFilterValueSchema = z.union([
  z.object({
    items: z.array(z.string()),
    rangeMax: z.undefined().optional(),
    rangeMin: z.undefined().optional(),
    type: z.literal('string'),
    value: z.undefined().optional(),
  }),
  z.object({
    items: z.undefined().optional(),
    rangeMax: z.union([z.number(), z.undefined()]),
    rangeMin: z.union([z.number(), z.undefined()]),
    type: z.literal('number'),
    value: z.undefined().optional(),
  }),
  z.object({
    items: z.undefined().optional(),
    rangeMax: z.undefined().optional(),
    rangeMin: z.undefined().optional(),
    type: z.literal('boolean'),
    value: z.boolean().nullable(),
  }),
]);

export const collectionDetailsFiltersSchema = z.record(
  z.number(),
  collectionDetailsFilterValueSchema,
);

export const collectionDetailsSearchQueriesSchema =
  getRequiredPaginationQueriesSchema<CollectionItemsTableColumn>('name').and(
    z.object({
      filters: collectionDetailsFiltersSchema.optional().default({}),
      ignoreSortArticles: z.boolean().default(true),
      searchNotes: z.boolean().default(false),
    }),
  );

export const getCollectionDetailsByIdSchema = z.object({
  collectionId: z.number(),
  params: collectionDetailsSearchQueriesSchema,
});
