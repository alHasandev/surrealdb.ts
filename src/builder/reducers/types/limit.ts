import type { Obj } from '~/core/data.types';
import type { FetchReducer } from './fetch';
import type { Query } from '~/core/query';
import type { ParallelReducer } from './parallel';
import type { StartReducer } from './start';
import type { TimeoutReducer } from './timeout';
import type { ExecuteQuery } from './exec';

export type LimitReducer<TData extends Obj> = (by: number) => Query<TData[]> & {
  query: () => Query<TData[]>;
  start: StartReducer<TData>;
  fetch: FetchReducer<TData>;
  timeout: TimeoutReducer<TData>;
  parallel: ParallelReducer<TData>;
  exec: ExecuteQuery<TData>;
};
