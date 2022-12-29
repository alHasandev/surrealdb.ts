import type { PartialID, RecordData } from '~/core/data.types';
import type { Query } from '~/core/query';
import type { ExecuteQuery } from './exec';

export type InsertReducer<TData extends RecordData> = (
  dataset: PartialID<TData>[] | Query<PartialID<TData>[]>
) => Query<TData[]> & {
  exec: ExecuteQuery<TData>;
};
