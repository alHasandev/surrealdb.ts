import { UnionToArray } from "~/core/utils.types"
import { Obj, RecordData } from "~/core/data.types"

export type SerializeObjectKey<
  TData extends Record<string, unknown>,
  P extends string = ""
> = {
  [K in keyof TData as K extends string
    ? TData[K] extends Record<string, unknown>
      ? keyof SerializeObjectKey<TData[K], `${P}${K}.`>
      : `${P}${K}`
    : never]: TData[K]
}

type GetSerializeValue<
  TData extends Record<string, unknown>,
  K extends string
> = K extends `${infer _P}.${infer C}`
  ? C extends keyof TData
    ? TData[C]
    : C extends `${infer N}.${infer _M}`
    ? N extends keyof TData
      ? TData[N] extends Record<string, unknown>
        ? GetSerializeValue<TData[N], C>
        : TData[N]
      : TData
    : TData
  : TData

export type SerializeObjectValue<TData extends Record<string, unknown>> = {
  [K in keyof TData]: K extends string
    ? TData[K] extends Record<string, unknown>
      ? GetSerializeValue<TData[K], K>
      : TData[K]
    : TData[K]
}

type GetOnlyRefKey<
  TData extends Record<string, unknown>,
  P extends string = ""
> = {
  [K in keyof TData]: K extends string
    ? TData[K] extends Array<infer I>
      ? I extends Record<string, unknown>
        ? UnionToArray<I> extends [infer _, infer T]
          ? T extends RecordData
            ? `${P}${K}`
            : never
          : GetOnlyRefKey<I, `${P}${K}.`>
        : I extends [infer _, infer T]
        ? T extends RecordData
          ? `${P}${K}`
          : never
        : K
      : UnionToArray<TData[K]> extends infer T
      ? T extends [infer _, infer T]
        ? T extends RecordData
          ? `${P}${K}`
          : never
        : never
      : never
    : never
}[keyof TData]

export type FetchKeys<TData extends Obj> = GetOnlyRefKey<
  SerializeObjectValue<SerializeObjectKey<TData>>
>
