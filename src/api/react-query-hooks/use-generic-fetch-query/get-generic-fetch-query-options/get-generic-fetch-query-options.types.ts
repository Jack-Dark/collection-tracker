import type {
  PlaceholderDataFunction,
  QueryOptions,
} from '@tanstack/react-query';

import type { DeepPartial } from '#/types';

import type { QueryKeyDef } from '../use-generic-fetch-query.types';

export type GetGenericFetchOptionsProps<
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any>,
  TTransformedData = TResponseDef,
> = Partial<
  Omit<
    QueryOptions<TTransformedData, Error, TTransformedData, QueryKeyDef>,
    'queryFn' | 'queryKey' | 'placeholderData'
  >
> & {
  placeholderData?:
    | DeepPartial<TResponseDef>
    | PlaceholderDataFunction<DeepPartial<TResponseDef>>;
  queryFn: (props: { data: TRequestArgs }) => Promise<TResponseDef>;
  queryKey: QueryKeyDef;
  requestArgs: TRequestArgs;
};
