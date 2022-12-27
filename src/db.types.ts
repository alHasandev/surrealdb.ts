import { ExecOptions } from './builder/options.types';
import { RecordData } from './core/data.types';
import { DatabaseSchema } from './schema.types';

export interface TableReducer<TData extends RecordData> {
  exec(options: ExecOptions): Promise<TData[]>;
}

export interface SurrealDB<DBSchema extends DatabaseSchema> {
  query: <TData>(
    query: string,
    vars?: Record<string, unknown>
  ) => Promise<TData[]>;

  table<Table extends keyof DBSchema & string>(
    table: Table
  ): TableReducer<DBSchema[Table]>;
}
