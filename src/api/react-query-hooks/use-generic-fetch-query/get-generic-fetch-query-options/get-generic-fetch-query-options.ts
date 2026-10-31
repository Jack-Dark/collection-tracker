import { queryOptions } from '@tanstack/react-query';

import type { GetGenericFetchOptionsProps } from './get-generic-fetch-query-options.types';

export const getGenericFetchQueryOptions = <
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<any, any>,
  TTransformedData = TResponseDef,
>(
  props: GetGenericFetchOptionsProps<
    TRequestArgs,
    TResponseDef,
    TTransformedData
  >,
) => {
  const { placeholderData, queryFn, requestArgs, ...configs } = props;

  const configuredQueryOptions = queryOptions({
    ...configs,
    placeholderData: placeholderData as undefined,
    queryFn: async () => {
      return queryFn({ data: requestArgs });
    },
  });

  return configuredQueryOptions;
};
