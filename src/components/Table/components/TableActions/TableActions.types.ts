import type { SortDirection } from '@tanstack/react-table';

import type { FiltersButtonPropsDef } from '../FilterButton/FilterButton.types';
import type { SearchPropsDef } from '../Search/Search.types';

export type TableActionsPropsDef<
  TSortByField extends string,
  TSortByData extends Record<any, any>,
> = {
  filters?: FiltersButtonPropsDef;
  search?: SearchPropsDef;
  sort?: {
    items: SortItemDef<TSortByField, TSortByData>[];
    onChange: (
      sort: SortItemDef<TSortByField, TSortByData> | null,
    ) => void | Promise<void>;
    value: SortItemDef<TSortByField, TSortByData> | undefined;
  };
};

export type SortItemDef<TField extends string, TData extends Record<any, any>> =
  | {
      data?: TData;
      direction: SortDirection;
      field: TField;
      id: string;
      label: string;
      separator?: never;
    }
  | {
      data?: TData;
      direction?: never;
      field?: never;
      id?: never;
      label?: never;
      separator: true;
    };
