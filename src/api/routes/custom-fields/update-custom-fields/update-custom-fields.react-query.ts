import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  UpdateCustomFieldsResponseDef,
  UpdateCustomFieldsRequestArgsDef,
} from './update-custom-fields.types';

import { updateCustomFieldsServerFn } from './update-custom-fields.serverFn';

export const useUpdateCustomFields = <
  TTransformedData = UpdateCustomFieldsResponseDef,
>(
  props?: GenericMutateQueryProps<
    UpdateCustomFieldsRequestArgsDef,
    UpdateCustomFieldsResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onUpdateCustomFields, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to update custom field.',
    mutationFn: updateCustomFieldsServerFn,
    mutationKey: [reactMutationKeys.customFields('update')],
    ...props,
  });

  return { ...rest, onUpdateCustomFields };
};
