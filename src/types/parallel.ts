import type { Obj } from '~/core/data.types';
import type { Query } from '~/core/query';
import type { ExecuteQuery } from './exec';

export type ParallelReducer<TData extends Obj> = () => Query<TData[]> & {
  exec: ExecuteQuery<TData>;
};
