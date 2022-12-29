import { RecordData } from "../core/data.types"
import { ComparisonOperator } from "../operator.types"
import { Query } from "../core/query"
import { Where } from "."
import { Group } from "../group"
import { Ref, RefProxy } from "../ref"

export interface WhereFunction<TData extends RecordData, RValue> {
  (
    conditions: (
      constraint: <Field extends keyof TData & string>(
        field: Field,
        comparator: ComparisonOperator,
        value: WhereValue<TData[Field]> | Query<WhereValue<TData[Field]>>
      ) => Where<TData, Field>,
      group: (
        query: Query<boolean> | Ref<TData, string, any>
      ) => Group<Query<boolean>>,
      ref: RefProxy<TData>
    ) => Query<boolean>
  ): RValue
}

export interface WhereFunction<TData extends RecordData, RValue> {
  <Field extends keyof TData & string>(
    field: Field,
    comparator: ComparisonOperator,
    value: WhereValue<TData[Field]> | Query<WhereValue<TData[Field]>>
  ): RValue
}

export type WhereValue<Value> = Value extends Array<infer T>
  ? T | T[] | null
  : Value | Value[] | null
