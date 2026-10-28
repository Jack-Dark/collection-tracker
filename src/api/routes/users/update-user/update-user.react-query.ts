import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  UpdateUserRequestArgsDef,
  UpdateUserResponseDef,
} from './update-user.types';

import { updateUserServerFn } from './update-user.serverFn';

export const useUpdateUser = <TTransformedData = UpdateUserResponseDef>(
  props?: GenericMutateQueryProps<
    UpdateUserRequestArgsDef,
    UpdateUserResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onUpdateUser, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to update user.',
    mutationFn: updateUserServerFn,
    mutationKey: [reactMutationKeys.users.update],
    ...props,
  });

  return { ...rest, onUpdateUser };
};
