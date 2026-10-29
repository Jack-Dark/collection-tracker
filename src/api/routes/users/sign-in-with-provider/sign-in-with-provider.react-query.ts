import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  SignInWithProviderRequestArgsDef,
  SignInWithProviderResponseDef,
} from './sign-in-with-provider.types';

import { signInWithProviderServerFn } from './sign-in-with-provider.serverFn';

export const useSignInWithProvider = (
  props?: GenericMutateQueryProps<
    SignInWithProviderRequestArgsDef,
    SignInWithProviderResponseDef
  >,
) => {
  const { onMutate: onSignInWithProvider, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to sign in. Please try again.',
    mutationFn: signInWithProviderServerFn,
    mutationKey: [reactMutationKeys.users.signInWithProvider],
    ...props,
    onSuccess: async (...args) => {
      await props?.onSuccess?.(...args);

      const { redirect, url } = args[0];

      if (redirect && url) {
        window.location.href = url;
      }
    },
  });

  return { ...rest, onSignInWithProvider };
};
