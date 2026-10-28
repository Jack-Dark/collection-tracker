import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';
import { useInvalidateEverything } from '#/api/react-query-hooks/use-invalidate-everything';

import type { SignInRequestArgsDef, SignInResponseDef } from './sign-in.types';

import { signInServerFn } from './sign-in.serverFn';

export const useSignIn = <TTransformedData = SignInResponseDef>(
  props?: GenericMutateQueryProps<
    SignInRequestArgsDef,
    SignInResponseDef,
    TTransformedData
  >,
) => {
  const invalidateEverything = useInvalidateEverything();

  const { onMutate: onSignIn, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to sign in. Please try again.',
    mutationFn: signInServerFn,
    mutationKey: [reactMutationKeys.users.signIn.viaEmail],
    ...props,
    onSuccess: async (...args) => {
      await invalidateEverything();

      await props?.onSuccess?.(...args);
    },
  });

  return { ...rest, onSignIn };
};
