import z from 'zod';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';

import type { OrderedCustomFieldForCollectionDef } from '../collections/get-paginated-collections/get-paginated-collections.types';

export const customFieldTypeSchema = z.union([
  z.literal('boolean'),
  z.literal('number'),
  z.literal('string'),
]) satisfies z.ZodType<CustomFieldTypeDef>;

export const baseCustomFieldSchema = z.object({
  name: z.string().min(1),
  type: customFieldTypeSchema,
});

export const customFieldWithIdSchema = baseCustomFieldSchema.extend({
  id: z.number().min(1),
});

const customFieldSortOrderSchema = z.number().min(0);

export const createCustomFieldFormSchema = z.object({
  customField: baseCustomFieldSchema.extend({
    id: z.string().min(1),
  }),
  order: customFieldSortOrderSchema,
}) satisfies z.ZodType<OrderedCustomFieldForCollectionDef<string | number>>;

export const updateCustomFieldFormSchema = z.object({
  customField: baseCustomFieldSchema.extend({
    id: z.number().min(1),
  }),
  order: customFieldSortOrderSchema,
}) satisfies z.ZodType<OrderedCustomFieldForCollectionDef<number>>;

export const customFieldFormSchema = z.union([
  createCustomFieldFormSchema,
  updateCustomFieldFormSchema,
]);
