import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';
import { useInvalidateEverything } from '#/api/react-query-hooks/use-invalidate-everything';

import type {
  SignInWithEmailRequestArgsDef,
  SignInWithEmailResponseDef,
} from './sign-in-with-email.types';

import { signInWithEmailServerFn } from './sign-in-with-email.serverFn';

export const useSignInWithEmail = <
  TTransformedData = SignInWithEmailResponseDef,
>(
  props?: GenericMutateQueryProps<
    SignInWithEmailRequestArgsDef,
    SignInWithEmailResponseDef,
    TTransformedData
  >,
) => {
  const invalidateEverything = useInvalidateEverything();

  const { onMutate: onSignInWithEmail, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to sign in. Please try again.',
    mutationFn: signInWithEmailServerFn,
    mutationKey: [reactMutationKeys.users.signInWithEmail],
    ...props,
    onSuccess: async (...args) => {
      await invalidateEverything();

      await props?.onSuccess?.(...args);
    },
  });

  return { ...rest, onSignInWithEmail };
};
