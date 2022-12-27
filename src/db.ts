import { ExecOptions } from './builder/options.types';
import { queryReducer } from './builder/reducers/query';
import { SurrealCore } from './core';
import { ResponseError } from './core/error';
import { TObj } from './core/utils.types';
import { SurrealDB as ISurrealDB, TableReducer } from './db.types';
import { DatabaseSchema } from './schema.types';

export class SurrealDB<DBSchema extends DatabaseSchema>
  implements ISurrealDB<DBSchema>
{
  constructor(surreal: SurrealCore) {
    this.core = surreal;
  }

  private core: SurrealCore;
  private tableName: string | undefined;

  async query<TData>(query: string, vars?: TObj) {
    const response = await this.core.query(query, vars);

    if (Array.isArray(response)) {
      const [data] = response;
      if (data.status === 'ERR')
        throw new ResponseError({
          code: 400,
          details: `${data.detail}`,
          description: `${data.detail}: (${query})`,
        });

      return data.result as TData[];
    }

    throw new ResponseError(response);
  }

  table<Table extends keyof DBSchema & string>(
    table: Table
  ): TableReducer<DBSchema[Table]> {
    this.tableName = table;
    return this as TableReducer<DBSchema[Table]>;
  }

  async exec<TData extends TObj>(options: ExecOptions) {
    if (!this.tableName)
      throw new ResponseError({
        code: 400,
        details: 'Table name must provided',
      });

    const query = queryReducer(this.tableName, options);

    const data = await this.query<TData>(query);

    if (data === null)
      throw new ResponseError({
        code: 404,
        details: `(${query}) query returning null instead of array of item`,
        information: `NULL RESPONSE`,
      });

    return data;
  }
}
