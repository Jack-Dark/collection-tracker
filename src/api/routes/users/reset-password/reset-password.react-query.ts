import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  ResetPasswordRequestArgsDef,
  ResetPasswordResponseDef,
} from './reset-password.types';

import { resetPasswordServerFn } from './reset-password.serverFn';

export const useResetPassword = <TTransformedData = ResetPasswordResponseDef>(
  props?: GenericMutateQueryProps<
    ResetPasswordRequestArgsDef,
    ResetPasswordResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onResetPassword, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to reset password.',
    mutationFn: resetPasswordServerFn,
    mutationKey: [reactMutationKeys.users.password.reset],
    ...props,
  });

  return { ...rest, onResetPassword };
};
