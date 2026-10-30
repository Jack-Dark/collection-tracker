import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';
import { useInvalidateEverything } from '#/api/react-query-hooks/use-invalidate-everything';
import { authClient } from '#/auth/auth-client';

import type {
  ImpersonateUserRequestArgsDef,
  ImpersonateUserResponseDef,
} from './impersonate-user.types';

import { impersonateUserServerFn } from './impersonate-user.serverFn';

export const useImpersonateUser = <
  TTransformedData = ImpersonateUserResponseDef,
>(
  props?: GenericMutateQueryProps<
    ImpersonateUserRequestArgsDef,
    ImpersonateUserResponseDef,
    TTransformedData
  >,
) => {
  const invalidateEverything = useInvalidateEverything();

  const { onMutate: onImpersonateUser, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to impersonate user.',
    mutationFn: impersonateUserServerFn,
    mutationKey: [reactMutationKeys.users.impersonate],
    ...props,
    onSuccess: async (...args) => {
      await invalidateEverything();

      authClient.clearLastUsedLoginMethod();

      await props?.onSuccess?.(...args);
    },
  });

  return { ...rest, onImpersonateUser };
};
