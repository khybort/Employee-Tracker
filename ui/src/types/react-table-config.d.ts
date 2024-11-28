import {
  UseSortByColumnOptions,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
} from 'react-table';

declare module 'react-table' {
  export interface TableOptions<D extends object>
    extends UseSortByOptions<D>,
      UsePaginationOptions<D>,
      Record<string, any> {}

  export interface TableInstance<D extends object = {}>
    extends UseSortByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      Record<string, any> {}

  export interface TableState<D extends object = {}>
    extends UseSortByState<D>,
      UsePaginationState<D> {}

  export type ColumnInstance<D extends object = {}> = UseSortByColumnOptions<D>;
}
