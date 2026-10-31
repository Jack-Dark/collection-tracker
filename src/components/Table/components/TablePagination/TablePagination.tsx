import { useMemo } from 'react';

import { SelectField } from '#/components/Fields/SelectField';

import type { TablePaginationPropsDef } from './TablePagination.types';

export const TablePagination = (props: {
  pagination: TablePaginationPropsDef;
}) => {
  const { pagination } = props;

  const limitItems = useMemo(() => {
    return new Array(5).fill(null).map((_, index) => {
      const value = (index + 1) * 50;

      return {
        label: value,
        value,
      };
    });
  }, []);

  const pageItems = useMemo(() => {
    return new Array(pagination.page?.max || 1).fill(null).map((_, index) => {
      const value = index + 1;

      return {
        label: value,
        value,
      };
    });
  }, [pagination.page?.max]);

  return (
    <div className="flex gap-4 items-center justify-between">
      <p>{pagination.totalRecords} results</p>
      <div className="flex gap-4 items-center">
        {pagination.limit && (
          <SelectField
            aria-label="Items per page"
            idProperty="value"
            items={limitItems}
            keyPrefix="limit"
            onValueChange={(item) => {
              if (item?.value) {
                pagination?.limit?.onChange?.(item.value);
              }
            }}
            RenderValue={({ item }) => {
              return <span>Per page: {item.label}</span>;
            }}
            value={{
              label: pagination.limit.value,
              value: pagination.limit.value,
            }}
          />
        )}

        {pagination.page && (
          <SelectField
            aria-label="Page number"
            idProperty="value"
            items={pageItems}
            keyPrefix="page"
            onValueChange={(item) => {
              if (item?.value) {
                pagination?.page?.onChange?.(item.value);
              }
            }}
            RenderValue={({ item }) => {
              return <span>Page: {item.label}</span>;
            }}
            value={{
              label: pagination.page.value,
              value: pagination.page.value,
            }}
          />
        )}
      </div>
    </div>
  );
};
