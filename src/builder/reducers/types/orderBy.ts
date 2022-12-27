import type { Obj } from '~/core/data.types';
import type { OrderDirection } from '~/select.types';
import type { FetchReducer } from './fetch';
import type { Query } from '~/core/query';
import type { LimitReducer } from './limit';
import type { ParallelReducer } from './parallel';
import type { StartReducer } from './start';
import type { TimeoutReducer } from './timeout';
import type { ExecuteQuery } from './exec';

export type OrderByReducer<TData extends Obj> = (by: {
  [K in keyof TData]?: OrderDirection;
}) => {
  query: () => Query<TData[]>;
  limit: LimitReducer<TData>;
  start: StartReducer<TData>;
  fetch: FetchReducer<TData>;
  timeout: TimeoutReducer<TData>;
  parallel: ParallelReducer<TData>;
  exec: ExecuteQuery<TData>;
};
