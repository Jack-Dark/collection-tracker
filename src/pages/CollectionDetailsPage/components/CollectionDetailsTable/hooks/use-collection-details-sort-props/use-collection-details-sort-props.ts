import type { CustomFieldTypeDef } from '#/api/db/db-tables-schema.types';
import type { UnformattedSortItemDef } from '#/hooks/use-format-sort-props';

import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { useFormatSortProps } from '#/hooks/use-format-sort-props';
import { useHandleGetCollectionDetailsById } from '#/pages/CollectionDetailsPage/CollectionDetailsPage';

import { useOnUpdateCollectionItemsQueries } from '../../../../hooks/use-on-update-collection-items-queries';

type CustomFieldSortFieldDef = `custom-field-${number}`;

type CollectionItemsSortFieldDef =
  'name' | 'createdAt' | CustomFieldSortFieldDef;

type CustomFieldSortItemDataDef = {
  customField: {
    id: number;
    type: CustomFieldTypeDef;
  };
};

type CustomFieldSortItemDef = UnformattedSortItemDef<
  CustomFieldSortFieldDef,
  CustomFieldSortItemDataDef
>;

export const useCollectionDetailsSortProps = () => {
  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const { data } = useHandleGetCollectionDetailsById();

  const sortProps = useFormatSortProps<
    CollectionItemsSortFieldDef,
    CustomFieldSortItemDataDef
  >({
    items: [
      {
        bidirectional: true,
        field: 'name',
        label: 'Name',
      },
      ...(data.collection?.customFields.reduce<CustomFieldSortItemDef[]>(
        (acc, customField) => {
          const { id, name, type } = customField;

          const sortFields: CustomFieldSortItemDef[] = [
            ...acc,
            { separator: true },
            {
              bidirectional: true,
              data: {
                customField: {
                  id,
                  type,
                },
              },
              field: `custom-field-${id}`,
              label: name,
            },
          ];

          return sortFields;
        },
        [],
      ) || []),
      { separator: true },
      {
        bidirectional: true,
        field: 'createdAt',
        label: 'Date Added',
      },
    ],
    onChange: (sort) => {
      onUpdateCollectionItemsQueries({
        sort: {
          data: sort?.data,
          direction: sort?.direction || sortDirectionOptions.asc,
          field: sort?.field || 'name',
        },
      });
    },
    searchQueries,
  });

  return sortProps;
};
