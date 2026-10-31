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

    const collectionDetails = await context.queryClient.query(queryOptions);

    return collectionDetails;
  },
  head: ({ loaderData }) => {
    const title = `${loaderData?.collection?.name || 'Collection Details'}: Collection Tracker`;

    const maxItems = 3;
    const numRecords = loaderData?.items?.length || 0;
    const numRecordsToList = Math.min(maxItems, numRecords);
    const hasMoreRecords = numRecords > maxItems;

    const description = loaderData?.items
      ?.slice(0, numRecordsToList)
      ?.reduce((acc, item, index) => {
        const isLastIndex = index === numRecordsToList - 1;

        if (isLastIndex) {
          if (hasMoreRecords) {
            return `${acc}${item.name}, etc...`;
          } else {
            return `${acc}${item.name}`;
          }
        } else {
          return `${acc}${item.name}, `;
        }
      }, '');

    return {
      meta: createMetaTags({
        title,
        description,
      }),
    };
  },
});
