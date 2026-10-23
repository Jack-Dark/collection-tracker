export type TablePaginationPropsDef = {
  limit?: {
    onChange: (limit: number) => void | Promise<void>;
    value: number;
  };
  page?: {
    max: number;
    onChange: (limit: number) => void | Promise<void>;
    value: number;
  };
  totalRecords: number;
};
