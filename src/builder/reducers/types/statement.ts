import type { RecordData } from '~/core/data.types';
import type {
  SelectReducer,
  CreateReducer,
  UpdateReducer,
  DeleteReducer,
  InsertReducer,
} from '.';

export interface StatementReducer<TData extends RecordData> {
  select: SelectReducer<TData>;
  create: CreateReducer<TData>;
  update: UpdateReducer<TData>;
  delete: DeleteReducer<TData>;
  insert: InsertReducer<TData>;
}

export default StatementReducer;
