import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericSuspenseQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetCollectionItemsWithCustomFieldValueRequestArgsDef,
  GetCollectionItemsWithCustomFieldValueResponseDef,
} from './get-collection-items-with-custom-field-value.types';

import { getCollectionItemsWithCustomFieldValueServerFn } from './get-collection-items-with-custom-field-value.serverFn';

export const useGetCollectionItemsWithCustomFieldValue = <
  TTransformedData = GetCollectionItemsWithCustomFieldValueResponseDef,
>(
  props: GenericFetchProps<
    GetCollectionItemsWithCustomFieldValueRequestArgsDef,
    GetCollectionItemsWithCustomFieldValueResponseDef,
    TTransformedData
  >,
) => {
  return useGenericSuspenseQuery({
    fallbackErrorMessage: 'Unable to retrieve collections items.',
    queryFn: getCollectionItemsWithCustomFieldValueServerFn,
    queryKey: [
      reactQueryKeys.getCollectionItemsWithCustomFieldValue,
      JSON.stringify(props.requestArgs),
    ],
    ...props,
  });
};

export const useInvalidateGetCollectionItemsWithCustomFieldValue =
  getUseInvalidateQuery<GetCollectionItemsWithCustomFieldValueRequestArgsDef>(
    reactQueryKeys.getCollectionItemsWithCustomFieldValue,
  );
