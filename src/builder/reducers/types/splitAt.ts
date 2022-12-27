import type { Obj } from '~/core/data.types';
import type { FetchReducer } from './fetch';
import type { LimitReducer } from './limit';
import type { OrderByReducer } from './orderBy';
import type { ParallelReducer } from './parallel';
import type { StartReducer } from './start';
import type { TimeoutReducer } from './timeout';
import type { ExecuteQuery } from './exec';
import type { GroupByReducer } from './groupBy';
import type { Query } from '~/core/query';
import type { ArrayToUnion } from '~/core/utils.types';
import type { Select } from '~/select.types';

export type SplitKeys<TData extends Obj> = keyof ({
  [K in keyof TData as TData[K] extends Array<any> ? K : never]: K;
} & {
  [K in keyof TData & string as TData[K] extends infer T
    ? T extends Obj
      ? keyof {
          [P in keyof T & string as T[P] extends Array<any>
            ? `${K}.${P}`
            : never]: P;
        }
      : never
    : never]: K;
});

export type SplitAt<TData extends Obj, SplitKeys extends string> = Omit<
  TData,
  SplitKeys
> & {
  [K in SplitKeys as K extends `${infer P}.${infer C}`
    ? P extends keyof TData
      ? K
      : never
    : K extends keyof TData
    ? K
    : never]: K extends keyof TData
    ? TData[K] extends Array<infer T>
      ? T
      : TData[K]
    : K extends `${infer P}.${infer C}`
    ? C extends keyof TData[P]
      ? TData[P][C] extends Array<infer T>
        ? Omit<TData[P], C> & Record<C, T>
        : never
      : never
    : never;
};

export type SplitAtReducer<TData extends Obj> = <
  Fields extends readonly SplitKeys<TData>[],
  SData extends Obj = TData extends Select<infer T, infer S, infer O>
    ? Select<SplitAt<T, ArrayToUnion<Fields> & string>, S, O>
    : SplitAt<TData, ArrayToUnion<Fields> & string>
>(
  fields: Fields
) => Query<SData[]> & {
  groupBy: GroupByReducer<SData>;
  orderBy: OrderByReducer<SData>;
  limit: LimitReducer<SData>;
  start: StartReducer<SData>;
  fetch: FetchReducer<SData>;
  timeout: TimeoutReducer<SData>;
  parallel: ParallelReducer<SData>;
  exec: ExecuteQuery<SData>;
};
