import type { QuerifyData, RecordData, SetData } from '~/core/data.types';
import type { Query } from '~/core/query';
import type { SetReducer } from './set';
import type { WhereReducer } from './where';
import type { ExecuteQuery } from './exec';

export type UpdateReducer<TData extends RecordData> = (
  idOrData?: string | Partial<QuerifyData<SetData<TData>>>
) => Query<TData[]> & {
  where: WhereReducer<TData>['UPDATE'];
  set: SetReducer<TData>['UPDATE'];
  exec: ExecuteQuery<TData>;
};
