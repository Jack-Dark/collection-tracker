import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { reactMutationKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { DeleteCollectionItemsByIdsSchemaDef } from './delete-collection-items-by-ids.type';

import { deleteCollectionItemsByIdsServerFn } from './delete-collection-items-by-ids.serverFn';

export const useDeleteCollectionItemsByIds = <TTransformedData = void>(
  props?: GenericMutateQueryProps<
    DeleteCollectionItemsByIdsSchemaDef,
    void,
    TTransformedData
  >,
) => {
  const { onMutate: onDeleteCollectionItemsByIds, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to delete item(s) from collection.',
      mutationFn: deleteCollectionItemsByIdsServerFn,
      mutationKey: [reactMutationKeys.collectionItems('delete')],
      ...props,
    });

  return { ...rest, onDeleteCollectionItemsByIds };
};
