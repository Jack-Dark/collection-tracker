import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  DeleteUserRequestArgsDef,
  DeleteUserResponseDef,
} from './delete-user.types';

import { deleteUserServerFn } from './delete-user.serverFn';

export const useDeleteUser = <TTransformedData = DeleteUserResponseDef>(
  props?: GenericMutateQueryProps<
    DeleteUserRequestArgsDef,
    DeleteUserResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onDeleteUser, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to delete user. Please try again.',
    mutationFn: deleteUserServerFn,
    mutationKey: [reactMutationKeys.users.delete],
    ...props,
  });

  return { ...rest, onDeleteUser };
};
