import type { NavigateOptions } from '@tanstack/router-core';

import { useNavigate, useSearch } from '@tanstack/react-router';

export const useOnUpdateCollectionItemsQueries = () => {
  const navigate = useNavigate({ from: '/collections/$id' });
  const searchQueries = useSearch({ from: '/_protected/collections/$id' });

  const onUpdateCollectionItemsQueries = async (
    updatedQueries: Partial<typeof searchQueries>,
    options?: NavigateOptions,
  ) => {
    const updatedQueriesKeys = Object.keys(
      updatedQueries,
    ) as (keyof typeof searchQueries)[];
    const shouldUsePage =
      updatedQueriesKeys.length === 1 && updatedQueriesKeys[0] === 'page';

    const newSearch = {
      ...searchQueries,
      ...updatedQueries,
      page: shouldUsePage ? updatedQueries.page : 1,
    };

    await navigate({
      search: newSearch,
      ...options,
    });
  };

  return { onUpdateCollectionItemsQueries, searchQueries };
};
