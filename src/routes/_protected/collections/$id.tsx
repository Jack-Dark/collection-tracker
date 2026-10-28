import { createFileRoute } from '@tanstack/react-router';

import { reactQueryKeys } from '#/api/react-query-hooks/react-query.constants';
import { getGenericFetchQueryOptions } from '#/api/react-query-hooks/use-generic-fetch-query/get-generic-fetch-query-options';
import { collectionDetailsSearchQueriesSchema } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.schema';
import { getCollectionDetailsByIdServerFn } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.serverFn';
import { CollectionDetailsPage } from '#/pages/CollectionDetailsPage';
import { createMetaTags } from '#/routes/__root';

export const Route = createFileRoute('/_protected/collections/$id')({
  component: CollectionDetailsPage,
  validateSearch: collectionDetailsSearchQueriesSchema,
  loaderDeps: ({ search }) => {
    return search;
  },
  loader: async ({ context, deps: searchQueries, params }) => {
    const collectionId = Number(params.id);

    const requestArgs = { collectionId, params: searchQueries };

    const queryOptions = getGenericFetchQueryOptions({
      queryFn: getCollectionDetailsByIdServerFn,
      queryKey: [
        reactQueryKeys.getCollectionDetailsById,
        requestArgs.collectionId,
        JSON.stringify(requestArgs),
      ],
      requestArgs,
    });

    const data = await context.queryClient.query(queryOptions);

    return {
      collectionName: data?.collection?.name,
      totalRecords: data?.pagination?.totalRecords || 0,
    };
  },
  head: ({ loaderData }) => {
    return {
      meta: createMetaTags({
        title: `${loaderData ? `${loaderData.collectionName} (${loaderData.totalRecords})` : 'Collection Details'}: Collection Tracker`,
      }),
    };
  },
});
