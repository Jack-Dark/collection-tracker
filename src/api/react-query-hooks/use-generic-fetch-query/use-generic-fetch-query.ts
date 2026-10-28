import { useSuspenseQuery } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';

import { useNotifications } from '#/components/Notifications/useNotifications';

import type { UseGenericFetchProps } from './use-generic-fetch-query.types';

import { getGenericFetchQueryOptions } from './get-generic-fetch-query-options';

/**
 * @example
 * export const use[YOUR_FETCH_QUERY_NAME] = <
 *   TTransformedData = YOUR_FETCH_RESPONSE_TYPE,
 * >(
 *   props?: GenericFetchProps<
 *     YOUR_FETCH_ARGS_TYPE,
 *     YOUR_FETCH_RESPONSE_TYPE,
 *     TTransformedData
 *   >,
 * ) => {
 *  return useGenericFetchQuery({
 *    fallbackErrorMessage: 'Unable to retrieve __________.',
 *    queryKey: [YOUR_UNIQUE_GROUP_NAME, props.requestArgs],
 *    query: YOUR_SERVER_FUNCTION,
 *    ...props,
 *  });
 * }
 *
 * export const useInvalidate[YOUR_FETCH_QUERY_NAME] =
 *   getUseInvalidateQuery<YOUR_FETCH_ARGS_TYPE>(
 *     YOUR_UNIQUE_GROUP_NAME
 *   );
 */
export const useGenericFetchQuery = <
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<any, any>,
  TTransformedData = TResponseDef,
>(
  props: UseGenericFetchProps<TRequestArgs, TResponseDef, TTransformedData>,
) => {
  const { fallbackErrorMessage, requestArgs, select, ...configs } = props;

  const { notifyError } = useNotifications();

  const configuredQueryOptions = getGenericFetchQueryOptions({
    ...configs,
    requestArgs,
  });

  const context = useSuspenseQuery({ ...configuredQueryOptions, select });

  const { error, isError } = context;

  useLayoutEffect(() => {
    if (isError) {
      const errorMsg = error?.message || fallbackErrorMessage;

      notifyError(errorMsg);
    }
  }, [isError, error, fallbackErrorMessage]);

  return context;
};
