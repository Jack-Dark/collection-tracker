import { createFileRoute } from '@tanstack/react-router';

import { getPaginatedCollectionsQueryOptions } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { collectionsListSearchQueriesSchema } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.schema';
import { createMetaTags } from '#/create-meta-tags';
import { CollectionsListPage } from '#/pages/CollectionsListPage';

export const Route = createFileRoute('/_protected/collections/')({
  component: CollectionsListPage,
  validateSearch: collectionsListSearchQueriesSchema,
  loaderDeps: ({ search }) => {
    return search;
  },
  loader: async ({ context, deps: searchQueries }) => {
    const queryOptions = getPaginatedCollectionsQueryOptions({
      params: searchQueries,
    });

    await context.queryClient.query(queryOptions);
  },
  head: () => {
    const title = 'Collections: Collection Tracker';

    return {
      meta: createMetaTags({
        title,
      }),
    };
  },
});
