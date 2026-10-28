import { useMutation } from '@tanstack/react-query';
import { isAPIError } from 'better-auth/api';
import { useLayoutEffect } from 'react';

import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { useNotifications } from '#/components/Notifications/useNotifications';

import type { UseGenericMutateQueryProps } from './use-generic-mutate-query.types';

/**
 * @example
 * export const useYourMutateQuery = <
 *   TTransformedData = YOUR_RESPONSE_TYPE,
 * >(
 *   props?: GenericMutateQueryProps<
 *     YOUR_REQUEST_ARGS_TYPE,
 *     YOUR_RESPONSE_TYPE,
 *     TTransformedData
 *   >,
 * ) => {
 * const { onMutate: YOUR_RETURNED_FUNCTION_NAME, ...rest } = useGenericMutateQuery({
 *     fallbackErrorMessage: 'Unable to ___________.',
 *     mutationFn: (data) => {
 *       return YOUR_SERVER_FUNCTION({ data });
 *     },
 *     ...props,
 * });
 *
 * return { ...rest, YOUR_RETURNED_FUNCTION_NAME };
 * };
 */
export const useGenericMutateQuery = <
  TRequestArgs extends Record<string, any>,
  TResponseDef extends Record<string, any> | void,
  TTransformedData = TResponseDef,
>(
  props: UseGenericMutateQueryProps<
    TRequestArgs,
    TResponseDef,
    TTransformedData
  >,
) => {
  const {
    fallbackErrorMessage,
    mutationFn,
    onError,
    onSettled,
    showLoading,
    transform,
    ...configs
  } = props;

  const { hideSpinner, isSpinning, showSpinner } = useSpinner();
  const { notifyError } = useNotifications();

  const handleMutationFn = async (
    ...requestArgs: Parameters<typeof mutationFn>
  ) => {
    const data = await mutationFn(...requestArgs);

    return transform ? transform(data) : (data as unknown as TTransformedData);
  };

  const { mutateAsync, ...context } = useMutation<
    TTransformedData,
    /* error type def */
    unknown,
    TRequestArgs
  >({
    mutationFn: handleMutationFn,
    onError: async (error, requestArgs) => {
      const message =
        error instanceof Error || isAPIError(error)
          ? error.message || fallbackErrorMessage
          : fallbackErrorMessage;

      notifyError(message);

      await onError?.(message, requestArgs);
    },
    onSettled: async (...args) => {
      if (showLoading && isSpinning) {
        hideSpinner();
      }
      await onSettled?.(...args);
    },
    ...configs,
  });

  const { isPending } = context;

  useLayoutEffect(() => {
    if (showLoading) {
      if (isPending) {
        showSpinner();
      }
    }
  }, [isPending]);

  return {
    ...context,
    onMutate: mutateAsync,
    /** Returns the same value as `isPending`. */
    processing: isPending,
  };
};
