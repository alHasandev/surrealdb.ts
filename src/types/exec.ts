import type { Obj } from '~/core/data.types';
import type { Query } from '~/core/query';
import { UnionToArray } from '~/core/utils.types';

export type ExecuteQuery<TData extends Obj> = () => Promise<
  InferQuery<TData>[]
>;

export type InferQuery<TData> = TData extends Query<infer T>
  ? T
  : TData extends Array<infer I>
  ? UnionToArray<I> extends [infer F, infer G]
    ? F extends null
      ? (null | G)[]
      : InferQuery<F | G>[]
    : I extends Query<infer T>
    ? T[]
    : InferQuery<I>[]
  : TData extends Obj
  ? {
      [K in keyof TData]: InferQuery<TData[K]>;
    }
  : TData;
