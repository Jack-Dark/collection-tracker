import z from 'zod';

import type { CollectionItemsTableColumn } from '../collection-item.types';

import { getRequiredPaginationQueriesSchema } from '../../../pagination/pagination.schema';

export const collectionDetailsFilterValueSchema = z.union([
  z.object({
    items: z
      .array(z.string().describe('Custom Field Value'))
      .describe('Custom Field Value Items'),
    range: z
      .object({
        max: z.undefined().describe('Max'),
        min: z.undefined().describe('Min'),
      })
      .optional()
      .describe('Custom Field Value Range'),
    type: z.literal('string').describe('Custom Field Type'),
    value: z.undefined().optional().describe('Custom Field Value'),
  }),
  z.object({
    items: z.undefined().optional().describe('Custom Field Value Items'),
    range: z
      .object({
        max: z.number().describe('Max'),
        min: z.number().describe('Min'),
      })
      .describe('Custom Field Value Range'),
    type: z.literal('number').describe('Custom Field Type'),
    value: z.undefined().optional().describe('Custom Field Value'),
  }),
  z.object({
    items: z.undefined().optional().describe('Custom Field Value Items'),
    range: z
      .object({
        max: z.undefined().optional().describe('Max'),
        min: z.undefined().optional().describe('Min'),
      })
      .optional()
      .describe('Custom Field Value Range'),
    type: z.literal('boolean').describe('Custom Field Type'),
    value: z.boolean().nullable().describe('Custom Field Value'),
  }),
]);

export const collectionDetailsFiltersSchema = z
  .record(
    z.number().describe('Custom Field ID'),
    collectionDetailsFilterValueSchema,
  )
  .describe('Filters');

export const collectionDetailsSearchQueriesSchema =
  getRequiredPaginationQueriesSchema<CollectionItemsTableColumn>('name').and(
    z.object({
      filters: collectionDetailsFiltersSchema.optional().default({}),
      ignoreSortArticles: z
        .boolean()
        .describe('Include "Notes" in search')
        .default(true),
      searchNotes: z
        .boolean()
        .describe('Include "Notes" in search')
        .default(false),
    }),
  );

export const getCollectionDetailsByIdSchema = z.object({
  collectionId: z.number(),
  params: collectionDetailsSearchQueriesSchema,
});
