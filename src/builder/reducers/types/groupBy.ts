import type { Obj } from '~/core/data.types';
import type { FetchReducer } from './fetch';
import type { LimitReducer } from './limit';
import type { OrderByReducer } from './orderBy';
import type { ParallelReducer } from './parallel';
import type { StartReducer } from './start';
import type { TimeoutReducer } from './timeout';
import type { ExecuteQuery } from './exec';
import type { SerializeObjectKey } from '~/ref/ref.types';

export type GroupByReducer<TData extends Obj> = <
  Field extends keyof SerializeObjectKey<TData>
>(
  fields: readonly Field[]
) => {
  orderBy: OrderByReducer<TData>;
  limit: LimitReducer<TData>;
  start: StartReducer<TData>;
  fetch: FetchReducer<TData>;
  timeout: TimeoutReducer<TData>;
  parallel: ParallelReducer<TData>;
  exec: ExecuteQuery<TData>;
};
