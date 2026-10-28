import z from 'zod';

import {
  paginationPropsDefaultValues,
  sortDirectionOptions,
} from './pagination.constants';

export const maxLimit = 100;

export const getRequiredPaginationQueriesSchema = <TSortField extends string>(
  defaultSortField: TSortField,
) => {
  return z.object({
    limit: z
      .number()
      .min(1)
      .max(maxLimit)
      .optional()
      .default(paginationPropsDefaultValues.limit),
    page: z
      .number()
      .min(1)
      .optional()
      .default(paginationPropsDefaultValues.page),
    search: z.string().optional().default(paginationPropsDefaultValues.search),
    sort: z
      .object({
        direction: z
          .union([
            z.literal(sortDirectionOptions.asc),
            z.literal(sortDirectionOptions.desc),
          ])
          .default(paginationPropsDefaultValues.sort.direction),
        field: z.string().default(defaultSortField),
      })
      .optional()
      .default({
        direction: paginationPropsDefaultValues.sort.direction,
        field: defaultSortField,
      }),
  });
};

export const getOptionalPaginationQueriesSchema = <TSortField extends string>(
  defaultSortField: TSortField,
) => {
  return getRequiredPaginationQueriesSchema(defaultSortField)
    .optional()
    .default(getPaginationQueryDefaults(defaultSortField));
};

export const getPaginationQueryDefaults = <TSortField extends string>(
  defaultSortField: TSortField,
): z.output<ReturnType<typeof getRequiredPaginationQueriesSchema>> => {
  return {
    limit: maxLimit,
    page: 1,
    search: '',
    sort: {
      direction: 'asc',
      field: defaultSortField,
    },
  };
};
