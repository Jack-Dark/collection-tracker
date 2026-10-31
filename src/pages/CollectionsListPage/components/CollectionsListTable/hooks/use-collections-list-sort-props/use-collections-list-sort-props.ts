import type { CreateOrUpdateCollectionFormRecordDef } from '#/pages/CollectionsListPage/CollectionsListPage.types';

import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { useFormatSortProps } from '#/hooks/use-format-sort-props';
import { useOnUpdateCollectionsListQueries } from '#/pages/CollectionsListPage/hooks/use-on-update-collection-list-queries';

export const useCollectionsListSortProps = () => {
  const { onUpdateCollectionsListQueries, searchQueries } =
    useOnUpdateCollectionsListQueries();

  const sortProps = useFormatSortProps<
    keyof CreateOrUpdateCollectionFormRecordDef
  >({
    items: [
      {
        bidirectional: true,
        field: 'name',
        label: 'Name',
      },
      { separator: true },
      {
        bidirectional: true,
        field: 'createdAt',
        label: 'Date added',
      },
    ],
    onChange: (sort) => {
      onUpdateCollectionsListQueries({
        sort: {
          direction: sort?.direction || sortDirectionOptions.asc,
          field: sort?.field || 'name',
        },
      });
    },
    searchQueries,
  });

  return sortProps;
};
