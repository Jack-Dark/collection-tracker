import type {
  PlaceholderDataFunction,
  UseQueryOptions,
} from '@tanstack/react-query';

import type { DeepPartial } from '#/types';

import type { reactQueryKeys } from '../react-query.constants';

// ? This type def applies the props passed to the hook when calling it
export type GenericFetchProps<
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any>,
  TTransformedData = TResponseDef,
> = Partial<
  Omit<
    UseQueryOptions<TResponseDef, Error, TTransformedData, QueryKeyDef>,
    'queryFn' | 'queryKey' | 'placeholderData'
  >
> & {
  placeholderData?:
    | DeepPartial<TResponseDef>
    | PlaceholderDataFunction<DeepPartial<TResponseDef>>;
  requestArgs: TRequestArgs;
};

// ? This type def applies specifically to the hook's props
export type UseGenericFetchProps<
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any>,
  TTransformedData = TResponseDef,
> = GenericFetchProps<TRequestArgs, TResponseDef, TTransformedData> & {
  fallbackErrorMessage: string;
  queryFn: (props: { data: TRequestArgs }) => Promise<TResponseDef>;
  queryKey: QueryKeyDef;
};

export type QueryKeyDef = Readonly<
  [ReactQueryKeysDef] | [ReactQueryKeysDef, ...(string | number)[]]
>;

export type ReactQueryKeysDef =
  (typeof reactQueryKeys)[keyof typeof reactQueryKeys];
