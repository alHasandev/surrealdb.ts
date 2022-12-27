import type { Obj } from '~/core/data.types';
import type { Query } from '~/core/query';
import type { ParallelReducer } from './parallel';
import type { ExecuteQuery } from './exec';

export type TimeoutReducer<TData extends Obj> = (duration: number) => Query<
  TData[]
> & {
  parallel: ParallelReducer<TData>;
  exec: ExecuteQuery<TData>;
};
