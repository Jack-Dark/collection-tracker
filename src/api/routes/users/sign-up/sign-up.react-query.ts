import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';
import { useInvalidateEverything } from '#/api/react-query-hooks/use-invalidate-everything';

import type { SignUpRequestArgsDef, SignUpResponseDef } from './sign-up.types';

import { signUpServerFn } from './sign-up.serverFn';

export const useSignUp = <TTransformedData = SignUpResponseDef>(
  props?: GenericMutateQueryProps<
    SignUpRequestArgsDef,
    SignUpResponseDef,
    TTransformedData
  >,
) => {
  const invalidateEverything = useInvalidateEverything();

  const { onMutate: onSignUp, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to sign up. Please try again.',
    mutationFn: signUpServerFn,
    mutationKey: [reactMutationKeys.users.signUp.viaEmail],
    ...props,
    onSuccess: async (...args) => {
      await invalidateEverything();

      await props?.onSuccess?.(...args);
    },
  });

  return { ...rest, onSignUp };
};
