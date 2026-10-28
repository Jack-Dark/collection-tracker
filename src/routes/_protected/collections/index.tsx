import { createFileRoute } from '@tanstack/react-router';

import { getPaginatedCollectionsQueryOptions } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.react-query';
import { collectionsListSearchQueriesSchema } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.schema';
import { CollectionsListPage } from '#/pages/CollectionsListPage';
import { createMetaTags } from '#/routes/__root';

export const Route = createFileRoute('/_protected/collections/')({
  component: (props) => {
    return <CollectionsListPage {...props} />;
  },
  validateSearch: collectionsListSearchQueriesSchema,
  loaderDeps: ({ search }) => {
    return search;
  },
  loader: async ({ context, deps: searchQueries }) => {
    const queryOptions = getPaginatedCollectionsQueryOptions({
      params: searchQueries,
    });

    return context.queryClient.query(queryOptions);
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
