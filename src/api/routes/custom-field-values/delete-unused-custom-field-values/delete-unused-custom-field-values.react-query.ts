import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  DeleteUnusedCustomFieldValuesResponseDef,
  DeleteUnusedCustomFieldValuesRequestArgsDef,
} from './delete-unused-custom-field-values.types';

import { deleteUnusedCustomFieldValuesServerFn } from './delete-unused-custom-field-values.serverFn';

export const useDeleteUnusedCustomFieldValues = <
  TTransformedData = DeleteUnusedCustomFieldValuesResponseDef,
>(
  props?: GenericMutateQueryProps<
    DeleteUnusedCustomFieldValuesRequestArgsDef,
    DeleteUnusedCustomFieldValuesResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onDeleteUnusedCustomFieldValues, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to delete unused custom field value(s).',
      mutationFn: (data) => {
        return deleteUnusedCustomFieldValuesServerFn({ data });
      },
      mutationKey: [reactMutationKeys.customFieldValues('delete-unused')],
      ...props,
    });

  return {
    ...rest,
    /** Due to the creation method of `number` type custom field values, it's possible for records to be created yet entirely unused. This helper function will delete all custom field values that are not associated with an item in a collection. */
    onDeleteUnusedCustomFieldValues,
  };
};
