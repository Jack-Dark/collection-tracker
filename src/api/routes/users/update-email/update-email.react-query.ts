import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  UpdateEmailRequestArgsDef,
  UpdateEmailResponseDef,
} from './update-email.types';

import { updateEmailServerFn } from './update-email.serverFn';

export const useUpdateEmail = <TTransformedData = UpdateEmailResponseDef>(
  props?: GenericMutateQueryProps<
    UpdateEmailRequestArgsDef,
    UpdateEmailResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onUpdateEmail, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to update email.',
    mutationFn: updateEmailServerFn,
    mutationKey: [reactMutationKeys.users.email.update],
    ...props,
  });

  return { ...rest, onUpdateEmail };
};
