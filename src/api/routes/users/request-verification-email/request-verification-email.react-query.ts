import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  RequestVerificationEmailRequestArgsDef,
  RequestVerificationEmailResponseDef,
} from './request-verification-email.types';

import { requestVerificationEmailServerFn } from './request-verification-email.serverFn';

export const useRequestVerificationEmail = <
  TTransformedData = RequestVerificationEmailResponseDef,
>(
  props?: GenericMutateQueryProps<
    RequestVerificationEmailRequestArgsDef,
    RequestVerificationEmailResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onRequestVerificationEmail, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to send verification email.',
      mutationFn: requestVerificationEmailServerFn,
      mutationKey: [reactMutationKeys.users.requestVerificationEmail],
      ...props,
    });

  return { ...rest, onRequestVerificationEmail };
};
