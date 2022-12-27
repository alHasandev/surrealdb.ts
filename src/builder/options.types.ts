import { Obj } from '../core/data.types';
import { ComparisonOperator } from '../operator.types';
import { Query } from '../core/query';
import { WhereKey } from './reducers/where';
import { Statement } from '../core/query.types';
import { AsignOptions } from '../entry';

export type Options = {
  statement: Statement;
  select?: [string[], Record<string, unknown> | undefined];
  where?: [WhereKey, ComparisonOperator, unknown];
  splitAt?: [string[]];
  groupBy?: [string[]];
  orderBy?: [Obj];
  limit?: [number];
  startAt?: [number];
  fetch?: [string[]];
  timeout?: [number];
  parallel?: [];
  create?: [
    string | undefined | Record<string, unknown>,
    Record<string, unknown> | undefined
  ];
  update?: [
    string | undefined | Record<string, unknown>,
    Record<string, unknown> | undefined
  ];
  set?: [Record<string, unknown>];
  insert?: [Obj[] | Query<Obj[]>];
  delete?: [string | undefined];
};

export type SelectOptions = {
  statement: 'SELECT';
  select: [string[], Record<string, unknown> | undefined];
  where?: [WhereKey, ComparisonOperator, unknown];
  splitAt?: [string[]];
  groupBy?: [string[]];
  orderBy?: [Obj];
  limit?: [number];
  startAt?: [number];
  fetch?: [string[]];
  timeout?: [number];
  parallel?: [];
};

export type CreateOptions = {
  statement: 'CREATE';
  create: [string | undefined | Record<string, unknown>];
  where?: [WhereKey, ComparisonOperator, unknown];
  timeout?: [number];
  parallel?: [];
  set?: [Record<string, unknown>];
};

export type UpdateOptions = {
  statement: 'UPDATE';
  where?: [WhereKey, ComparisonOperator, unknown];
  timeout?: [number];
  parallel?: [];
  update?: [string | undefined | Obj];
  set?: [Obj | ((asign: AsignOptions) => Obj)];
};

export type InsertOptions = {
  statement: 'INSERT';
  where?: [WhereKey, ComparisonOperator, unknown];
  timeout?: [number];
  parallel?: [];
  insert?: [Obj[] | Query<Obj[]>];
};

export type DeleteOptions = {
  statement: 'DELETE';
  where?: [WhereKey, ComparisonOperator, unknown];
  timeout?: [number];
  parallel?: [];
  delete?: [string | undefined];
};

export type ExecOptions =
  | SelectOptions
  | CreateOptions
  | UpdateOptions
  | DeleteOptions
  | InsertOptions;
