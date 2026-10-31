import type { PaginationMetadata } from '#/api/pagination/pagination.types';

import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useOnUpdateCollectionItemsQueries } from '../../../../hooks/use-on-update-collection-items-queries';

export const useCollectionDetailsPaginationProps = (props: {
  pagination: PaginationMetadata;
}) => {
  const { pagination } = props;

  const searchQueries = CollectionRoute.useSearch();

  const { onUpdateCollectionItemsQueries } =
    useOnUpdateCollectionItemsQueries();

  const paginationProps = {
    limit: {
      onChange: (limit: number) => {
        onUpdateCollectionItemsQueries({ limit });
      },
      value: searchQueries.limit || 100,
    },
    page: {
      max: pagination.totalPages,
      onChange: (page: number) => {
        onUpdateCollectionItemsQueries({ page });
      },
      value: searchQueries.page || 1,
    },
    totalRecords: pagination?.totalRecords || 0,
  };

  return paginationProps;
};
