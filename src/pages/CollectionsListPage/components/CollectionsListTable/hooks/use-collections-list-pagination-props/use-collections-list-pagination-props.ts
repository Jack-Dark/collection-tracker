import { useSearch } from '@tanstack/react-router';

import type { PaginationMetadata } from '#/api/pagination/pagination.types';

import { getPaginationMetadataDefaults } from '#/api/pagination/pagination.constants';
import { useOnUpdateCollectionsListQueries } from '#/pages/CollectionsListPage/hooks/use-on-update-collection-list-queries';

export const useCollectionsListPaginationProps = (props: {
  pagination: PaginationMetadata;
}) => {
  const { pagination = getPaginationMetadataDefaults(1000) } = props;

  const search = useSearch({ from: '/_protected/collections/' });

  const { onUpdateCollectionsListQueries } =
    useOnUpdateCollectionsListQueries();

  const paginationProps = {
    limit: {
      onChange: (limit: number) => {
        onUpdateCollectionsListQueries({ limit });
      },
      value: search.limit || 100,
    },
    page: {
      max: pagination.totalPages,
      onChange: (page: number) => {
        onUpdateCollectionsListQueries({ page });
      },
      value: search.page || 1,
    },
    totalRecords: pagination?.totalRecords || 0,
  };

  return paginationProps;
};
