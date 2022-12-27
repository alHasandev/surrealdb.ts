import { ArrayToUnion, UnionToArray } from './core/utils.types';
import { InferRef, Obj, RecordData, RecordRef } from './core/data.types';
import { FetchKeys } from './ref/ref.types';

export type Fetch<
  TData extends Obj,
  FKeys extends readonly FetchKeys<TData>[]
> = ArrayToUnion<FKeys> extends FetchKeys<TData>
  ? Omit<
      TData,
      ArrayToUnion<FKeys> extends `${infer P}.${infer _C}`
        ? P
        : ArrayToUnion<FKeys>
    > & {
      [K in ArrayToUnion<FKeys> as K extends `${infer P}.${infer _C}`
        ? P
        : K]: K extends `${infer P}.${infer C}`
        ? number extends keyof TData[P]
          ? TData[P][number] extends RecordData
            ? C extends FetchKeys<TData[P][number]>
              ? Fetch<TData[P][number], [C]>[]
              : never
            : never
          : TData[P] extends RecordData
          ? C extends FetchKeys<TData[P]>
            ? Fetch<TData[P], [C]>
            : never
          : never
        : K extends keyof TData
        ? TData[K] extends RecordRef<RecordData>
          ? InferRef<TData[K]> | null
          : TData[K] extends RecordRef<RecordData>[]
          ? TData[K] extends Array<infer T>
            ? UnionToArray<T> extends [infer _, infer S]
              ? (S | null)[]
              : never
            : never
          : never
        : never;
    }
  : never;
