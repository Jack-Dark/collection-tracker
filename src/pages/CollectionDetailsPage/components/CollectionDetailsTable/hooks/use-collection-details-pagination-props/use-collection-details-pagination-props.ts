import { useSearch } from '@tanstack/react-router';

import type { PaginationMetadata } from '#/api/pagination/pagination.types';

import { useOnUpdateCollectionItemsQueries } from '../../../../hooks/use-on-update-collection-items-queries';

export const useCollectionDetailsPaginationProps = (props: {
  pagination: PaginationMetadata;
}) => {
  const { pagination } = props;

  const searchQueries = useSearch({ from: '/_protected/collections/$id' });

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
