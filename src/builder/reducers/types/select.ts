import type { Obj, RecordData } from '~/core/data.types';
import type { Select, SelectFields } from '~/select.types';
import type { ArrayToUnion } from '~/core/utils.types';
import type { Query } from '~/core/query';
import type { FetchReducer } from './fetch';
import type { GroupByReducer } from './groupBy';
import type { LimitReducer } from './limit';
import type { OrderByReducer } from './orderBy';
import type { ParallelReducer } from './parallel';
import type { StartReducer } from './start';
import type { TimeoutReducer } from './timeout';
import type { WhereReducer } from './where';
import type { ExecuteQuery } from './exec';
import { SplitAtReducer } from './splitAt';

export type SelectReducer<TData extends RecordData> = <
  Fields extends SelectFields<TData>,
  FieldAs extends Obj = {},
  SData extends Obj = Select<TData, ArrayToUnion<Fields>, FieldAs>
>(
  fields: Fields,
  fieldAs?: FieldAs
) => Query<SData[]> & {
  where: WhereReducer<SData>['SELECT'];
  splitAt: SplitAtReducer<SData>;
  groupBy: GroupByReducer<SData>;
  orderBy: OrderByReducer<SData>;
  limit: LimitReducer<SData>;
  start: StartReducer<SData>;
  fetch: FetchReducer<SData>;
  timeout: TimeoutReducer<SData>;
  parallel: ParallelReducer<SData>;
  exec: ExecuteQuery<SData>;
};
