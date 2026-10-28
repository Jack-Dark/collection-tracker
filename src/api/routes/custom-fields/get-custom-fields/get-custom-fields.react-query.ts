import type { GenericFetchProps } from '#/api/react-query-hooks/use-generic-fetch-query/use-generic-fetch-query.types';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { useGenericSuspenseQuery } from '#/api/react-query-hooks/use-generic-fetch-query';
import { getUseInvalidateQuery } from '#/api/react-query-hooks/use-generic-fetch-query/hooks/get-use-invalidate-query-cache';

import type {
  GetCustomFieldsResponseDef,
  GetCustomFieldsRequestArgsDef,
} from './get-custom-fields.types';

import { getCustomFieldsServerFn } from './get-custom-fields.serverFn';

export const useGetCustomFields = <
  TTransformedData = GetCustomFieldsResponseDef,
>(
  props: GenericFetchProps<
    GetCustomFieldsRequestArgsDef,
    GetCustomFieldsResponseDef,
    TTransformedData
  >,
) => {
  return useGenericSuspenseQuery({
    fallbackErrorMessage: 'Unable to retrieve custom fields.',
    queryFn: getCustomFieldsServerFn,
    queryKey: [
      reactQueryKeys.getCustomFields,
      JSON.stringify(props.requestArgs),
    ],
    ...props,
  });
};

export const useInvalidateGetCustomFields =
  getUseInvalidateQuery<GetCustomFieldsRequestArgsDef>(
    reactQueryKeys.getCustomFields,
  );
