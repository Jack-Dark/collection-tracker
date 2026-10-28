import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericSuspenseQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetCollectionsWithCustomFieldsRequestArgsDef,
  GetCollectionsWithCustomFieldsResponseDef,
} from './get-collections-with-custom-field.types';

import { getCollectionsWithCustomFieldsServerFn } from './get-collections-with-custom-field.serverFn';

// TODO - REFACTOR: RENAME TO BE MORE APPROPRIATE TO ITS USAGE
export const useGetCollectionsWithCustomFields = <
  TTransformedData = GetCollectionsWithCustomFieldsResponseDef,
>(
  props: GenericFetchProps<
    GetCollectionsWithCustomFieldsRequestArgsDef,
    GetCollectionsWithCustomFieldsResponseDef,
    TTransformedData
  >,
) => {
  return useGenericSuspenseQuery({
    fallbackErrorMessage: 'Unable to retrieve collections.',
    queryFn: getCollectionsWithCustomFieldsServerFn,
    queryKey: [
      reactQueryKeys.getCollectionsWithCustomFields,
      JSON.stringify(props.requestArgs),
    ],
    ...props,
  });
};

export const useInvalidateGetCollectionsWithCustomFields =
  getUseInvalidateQuery<GetCollectionsWithCustomFieldsRequestArgsDef>(
    reactQueryKeys.getCollectionsWithCustomFields,
  );
