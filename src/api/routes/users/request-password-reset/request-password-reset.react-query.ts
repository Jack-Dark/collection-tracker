import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  RequestPasswordResetRequestArgsDef,
  RequestPasswordResetResponseDef,
} from './request-password-reset.types';

import { requestPasswordResetServerFn } from './request-password-reset.serverFn';

export const useRequestPasswordReset = <
  TTransformedData = RequestPasswordResetResponseDef,
>(
  props?: GenericMutateQueryProps<
    RequestPasswordResetRequestArgsDef,
    RequestPasswordResetResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onRequestPasswordReset, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to request password reset.',
    mutationFn: requestPasswordResetServerFn,
    mutationKey: [reactMutationKeys.users.password.requestReset],
    ...props,
  });

  return { ...rest, onRequestPasswordReset };
};
