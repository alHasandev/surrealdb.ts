import type { Obj } from '~/core/data.types';
import type { Fetch } from '~/fetch.types';
import type { FetchKeys } from '~/ref/ref.types';
import type { Query } from '~/core/query';
import type { ParallelReducer } from './parallel';
import type { TimeoutReducer } from './timeout';
import type { ExecuteQuery, InferQuery } from './exec';

export type FetchReducer<TData extends Obj> = <
  Fields extends FetchKeys<InferQuery<TData>>[],
  RData extends Obj = Fetch<InferQuery<TData>, Fields>
>(
  fields: Fields
) => Query<RData[]> & {
  timeout: TimeoutReducer<RData>;
  parallel: ParallelReducer<RData>;
  exec: ExecuteQuery<RData>;
};
