import { ResponseError } from '../../core/error';
import { Statement } from '../../core/query.types';
import { Obj, RecordData } from '../../core/data.types';
import { Query } from '../../core/query';
import { ExecOptions } from '../options.types';
import { queryReducer } from './query';
import { StatementReducer } from './types';
import { createRecordRef, RefProxy } from '../../ref';

export class QueryReducer<
  TData extends RecordData,
  TableName extends string,
  SurrealQuery extends StatementReducer<TData> = StatementReducer<TData>
> extends Query<TData[]> {
  constructor(tableName: TableName) {
    super(`SELECT * FROM ${tableName}`);
    this.statement = 'SELECT';
    this.options.statement = 'SELECT';
    this.options.table = tableName;
    this.options.select = [['*']];
    this.table = tableName;
    this.ref = createRecordRef<TData>();
  }

  protected options: Obj = {};
  protected table: TableName;
  protected statement: Statement;
  protected id?: string;

  async exec(): Promise<TData[]> {
    throw new ResponseError({
      code: 500,
      details: 'Query Executor method not implented',
      information:
        'Extend this class "QueryProxy" and implement exec() method to execute query to database',
    });
  }

  toString(): string {
    return queryReducer(this.table, this.options as ExecOptions);
  }

  protected proxy(): SurrealQuery {
    const proxy = new Proxy(this, {
      get(target, prop, receiver) {
        switch (prop) {
          case 'getOptions':
            return () => target.options;
          case 'exec':
            return () => target.exec();
          case 'toJSON':
          case 'toString':
          case Symbol.toPrimitive:
            console.log(target.options);
            return () => target.toString();

          default:
            return function (...args: unknown[]) {
              console.log('🚀 ~ file: proxy.ts:101 ~ prop, args', prop, args);
              target.options[prop as keyof Obj] = args;

              return receiver;
            };
        }
      },
    });

    return proxy as unknown as SurrealQuery;
  }

  ref: RefProxy<TData>;
}
