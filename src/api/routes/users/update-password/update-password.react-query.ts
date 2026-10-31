import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  UpdatePasswordRequestArgsDef,
  UpdatePasswordResponseDef,
} from './update-password.types';

import { updatePasswordServerFn } from './update-password.serverFn';

export const useUpdatePassword = <TTransformedData = UpdatePasswordResponseDef>(
  props?: GenericMutateQueryProps<
    UpdatePasswordRequestArgsDef,
    UpdatePasswordResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onUpdatePassword, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to update password.',
    mutationFn: updatePasswordServerFn,
    mutationKey: [reactMutationKeys.users.password.update],
    ...props,
  });

  return { ...rest, onUpdatePassword };
};
