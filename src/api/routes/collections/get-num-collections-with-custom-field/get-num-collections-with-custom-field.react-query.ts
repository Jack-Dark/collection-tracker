import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericSuspenseQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetNumCollectionsWithCustomFieldRequestArgsDef,
  GetNumCollectionsWithCustomFieldResponseDef,
} from './get-num-collections-with-custom-field.types';

import { getNumCollectionsWithCustomFieldServerFn } from './get-num-collections-with-custom-field.serverFn';

export const useGetNumCollectionsWithCustomField = <
  TTransformedData = GetNumCollectionsWithCustomFieldResponseDef,
>(
  props: GenericFetchProps<
    GetNumCollectionsWithCustomFieldRequestArgsDef,
    GetNumCollectionsWithCustomFieldResponseDef,
    TTransformedData
  >,
) => {
  return useGenericSuspenseQuery({
    fallbackErrorMessage: 'Unable to retrieve collections.',
    queryFn: getNumCollectionsWithCustomFieldServerFn,
    queryKey: [
      reactQueryKeys.getNumCollectionsWithCustomField,
      JSON.stringify(props.requestArgs),
    ],
    ...props,
  });
};

export const useInvalidateGetNumCollectionsWithCustomField =
  getUseInvalidateQuery<GetNumCollectionsWithCustomFieldRequestArgsDef>(
    reactQueryKeys.getNumCollectionsWithCustomField,
  );
