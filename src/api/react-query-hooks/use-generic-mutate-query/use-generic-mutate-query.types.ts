import type { UseMutationOptions } from '@tanstack/react-query';

// ? This type def applies the props passed to the hook when calling it
export interface GenericMutateQueryProps<
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any> | void,
  TTransformedData = TResponseDef,
> extends Partial<
  Omit<
    UseMutationOptions<TTransformedData, unknown, TRequestArgs, unknown>,
    'onError' | 'mutationFn'
  >
> {
  onError?: (error: string, requestArgs?: TRequestArgs) => Promise<void> | void;
  showLoading?: boolean;
  transform?: (response: TResponseDef) => TTransformedData;
}

// ? This type def applies specifically to the hook's props
export interface UseGenericMutateQueryProps<
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any> | void,
  TTransformedData = TResponseDef,
> extends Omit<
  GenericMutateQueryProps<TRequestArgs, TResponseDef, TTransformedData>,
  'requestArgs'
> {
  fallbackErrorMessage: string;
  mutationFn: (args: { data: TRequestArgs }) => Promise<TResponseDef>;
}
