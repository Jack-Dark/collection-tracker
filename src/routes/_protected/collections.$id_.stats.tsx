import { createFileRoute } from '@tanstack/react-router';

import { getCollectionStatsByIdQueryOptions } from '#/api/routes/collection-items/get-collection-stats-by-id/get-collection-stats-by-id.react-query';
import { createMetaTags } from '#/create-meta-tags';
import { CollectionStatsPage } from '#/pages/CollectionStatsPage';

// ? The underscore suffix ensures this route is considered a its own page and not a child page of collections/$id. This essentially means that it renders its own component instead of relying on the parent route's <Output />, which does not exist.
export const Route = createFileRoute('/_protected/collections/$id_/stats')({
  component: CollectionStatsPage,
  loader: async ({ context, params }) => {
    const queryOptions = getCollectionStatsByIdQueryOptions({
      collectionId: Number(params.id),
    });

    const data = await context.queryClient.query(queryOptions);

    return {
      collectionName: data?.name,
    };
  },
  head: ({ loaderData }) => {
    return {
      meta: createMetaTags({
        title: `${loaderData?.collectionName || 'Collection'} Stats: Collection Tracker`,
      }),
    };
  },
});
