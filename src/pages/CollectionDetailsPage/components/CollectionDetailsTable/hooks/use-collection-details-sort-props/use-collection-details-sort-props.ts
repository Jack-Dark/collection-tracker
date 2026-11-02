import type { CreateOrUpdateCollectionItemFormRowDataDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { useFormatSortProps } from '#/hooks/use-format-sort-props';

import { useOnUpdateCollectionItemsQueries } from '../../../../hooks/use-on-update-collection-items-queries';

export const useCollectionDetailsSortProps = () => {
  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const sortProps = useFormatSortProps<
    keyof CreateOrUpdateCollectionItemFormRowDataDef
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
      onUpdateCollectionItemsQueries({
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
