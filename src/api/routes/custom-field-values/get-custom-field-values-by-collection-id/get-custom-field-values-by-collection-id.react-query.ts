import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericSuspenseQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetCustomFieldValuesByCustomFieldIdResponseDef,
  GetCustomFieldValuesByCustomFieldIdRequestArgsDef,
} from './get-custom-field-values-by-collection-id.types';

import { getCustomFieldValuesByCustomFieldIdServerFn } from './get-custom-field-values-by-collection-id.serverFn';

export const useGetCustomFieldValuesByCustomFieldId = <
  TTransformedData = GetCustomFieldValuesByCustomFieldIdResponseDef,
>(
  props: GenericFetchProps<
    GetCustomFieldValuesByCustomFieldIdRequestArgsDef,
    GetCustomFieldValuesByCustomFieldIdResponseDef,
    TTransformedData
  >,
) => {
  return useGenericSuspenseQuery({
    fallbackErrorMessage: 'Unable to retrieve custom field values.',
    queryFn: getCustomFieldValuesByCustomFieldIdServerFn,
    queryKey: [
      reactQueryKeys.getCustomFieldValuesByCustomFieldId,
      props.requestArgs.id,
    ],
    ...props,
  });
};

export const useInvalidateGetCustomFieldValuesByCustomFieldId =
  getUseInvalidateQuery<GetCustomFieldValuesByCustomFieldIdRequestArgsDef>(
    reactQueryKeys.getCustomFieldValuesByCustomFieldId,
  );
