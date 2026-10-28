import { useQuery } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';

import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
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
export const useGenericQuery = <
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<any, any>,
  TTransformedData = TResponseDef,
>(
  props: UseGenericFetchProps<TRequestArgs, TResponseDef, TTransformedData>,
) => {
  const {
    fallbackErrorMessage,
    onError,
    onSuccess,
    requestArgs,
    select,
    showLoading,
    ...configs
  } = props;

  const { hideSpinner, isSpinning, showSpinner } = useSpinner();
  const { notifyError } = useNotifications();

  const configuredQueryOptions = getGenericFetchQueryOptions({
    ...configs,
    requestArgs,
  });

  const context = useQuery({ ...configuredQueryOptions, select });

  const { data, error, isError, isFetching, isSuccess } = context;

  useLayoutEffect(() => {
    if (showLoading) {
      if (isFetching) {
        showSpinner();
      } else if (isSpinning) {
        hideSpinner();
      }
    }
  }, [isFetching]);

  useLayoutEffect(() => {
    if (isSuccess) {
      onSuccess?.(data, requestArgs);
    }
  }, [
    isSuccess,
    // ? Providing context.data ensures that onSuccess is executed any time the data changes, even if provided from a cached response
    data,
  ]);

  useLayoutEffect(() => {
    if (isError) {
      const errorMsg = error?.message || fallbackErrorMessage;

      notifyError(errorMsg);

      onError?.(errorMsg, requestArgs);
    }
  }, [isError, error, fallbackErrorMessage]);

  return context;
};
