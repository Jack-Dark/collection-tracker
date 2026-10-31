import { createFileRoute } from '@tanstack/react-router';

import { getCollectionDetailsByIdQueryOptions } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { collectionDetailsSearchQueriesSchema } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.schema';
import { CollectionDetailsPage } from '#/pages/CollectionDetailsPage';
import { createMetaTags } from '#/routes/__root';

export const Route = createFileRoute('/_protected/collections/$id')({
  component: CollectionDetailsPage,
  validateSearch: collectionDetailsSearchQueriesSchema,
  loaderDeps: ({ search }) => {
    return search;
  },
  loader: async ({ context, deps: searchQueries, params }) => {
    const queryOptions = getCollectionDetailsByIdQueryOptions({
      collectionId: Number(params.id),
      params: searchQueries,
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
