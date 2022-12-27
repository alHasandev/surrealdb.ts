import { Where } from "~/builder/where"
import { RecordData } from "~/core/data.types"
import { Fetch } from "~/fetch.types"
import { ComparisonOperator } from "~/operator.types"
import {
  FetchKeys,
  SerializeObjectKey,
  SerializeObjectValue,
} from "~/ref/ref.types"
import { UnionToArray } from "~/core/utils.types"
import { Query } from "~/core/query"

export interface ArrayRef<
  TData extends RecordData,
  Field extends (keyof TData & string) | FetchKeys<TData>,
  FData extends Record<string, unknown> = Field extends FetchKeys<TData>
    ? Fetch<TData, [Field]>
    : TData,
  RefData extends RecordData[] = GetRefData<FData, Field> extends RecordData[]
    ? GetRefData<FData, Field>
    : never,
  RData extends RecordData = RefData extends Array<infer T> ? T : RefData
> extends Query {
  where<Field extends keyof RData & string>(
    constraint: readonly [Field, ComparisonOperator, RData[Field]]
  ): Where<RData, Field>
}

export interface ObjectRef<
  TData extends RecordData,
  Field extends (keyof TData & string) | FetchKeys<TData>,
  FData extends Record<string, unknown> = Field extends FetchKeys<TData>
    ? Fetch<TData, [Field]>
    : TData,
  RefData extends RecordData = GetRefData<FData, Field> extends RecordData
    ? GetRefData<FData, Field>
    : never
> extends Query {
  where<Field extends keyof RefData & string>(
    field: Field,
    comparator: ComparisonOperator,
    value: RefData[Field]
  ): Where<RefData, Field>
}

export type GetRefData<
  TData extends Record<string, unknown>,
  Key extends string
> = Key extends keyof TData
  ? TData[Key] extends Array<infer D>
    ? UnionToArray<D> extends [infer T, infer _]
      ? T[]
      : TData[Key]
    : UnionToArray<TData[Key]> extends [infer T, infer _]
    ? T
    : never
  : SerializeObjectValue<SerializeObjectKey<TData>> extends infer FData
  ? Key extends keyof FData
    ? UnionToArray<FData[Key]> extends [infer T, infer _]
      ? T
      : never
    : never
  : never
