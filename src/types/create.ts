import type { PartialID, QuerifyData, RecordData } from '~/core/data.types';
import type { Query } from '~/core/query';
import type { ExecuteQuery } from './exec';
import type { SetReducer } from './set';

export type CreateReducer<TData extends RecordData> = (
  idOrData?: string | QuerifyData<PartialID<TData>>
) => Query<TData[]> & {
  set: SetReducer<TData>['CREATE'];
  exec: ExecuteQuery<TData>;
};
