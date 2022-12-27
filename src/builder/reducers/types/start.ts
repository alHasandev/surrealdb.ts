import type { Obj } from '~/core/data.types';
import type { FetchReducer } from './fetch';
import type { ParallelReducer } from './parallel';
import type { TimeoutReducer } from './timeout';
import type { ExecuteQuery } from './exec';

export type StartReducer<TData extends Obj> = (at: number) => {
  fetch: FetchReducer<TData>;
  timeout: TimeoutReducer<TData>;
  parallel: ParallelReducer<TData>;
  exec: ExecuteQuery<TData>;
};
