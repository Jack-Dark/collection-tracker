import { createFileRoute } from '@tanstack/react-router';

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
  head: () => {
    const title = 'Collections: Collection Tracker';

    return {
      meta: createMetaTags({
        title,
      }),
    };
  },
});
