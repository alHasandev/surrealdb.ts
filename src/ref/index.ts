import { Where } from "../where"
import { safeValue } from "../core/helpers"
import { Query } from "../core/query"
import type { WhereValue } from "../where/types"
import type { UnionToArray } from "../core/utils.types"
import type { Obj, RecordData } from "../core/data.types"
import type { ComparisonOperator } from "../operator.types"

type ObjectRef<
  TData extends Obj,
  Key extends string,
  Item = GetSerializeValue<TData, Key>
> = {
  [K in keyof Item & string]: Item[K] extends Array<infer I>
    ? I extends Obj
      ? ArrayRef<TData, `${Key}.${K}`, I> &
          PrimitiveRef<TData, `${Key}.${K}`, I> &
          ObjectRef<TData, `${Key}.${K}`, I>
      : PrimitiveRef<TData, `${Key}.${K}`, I[]>
    : Item[K] extends Obj
    ? ObjectRef<TData, `${Key}.${K}`>
    : PrimitiveRef<TData, `${Key}.${K}`>
}

type ArrayItemRef<TData extends Obj, K extends string, I> = I extends Obj
  ? ArrayRef<TData, K, I> & PrimitiveRef<TData, K, I> & ObjectRef<TData, K, I>
  : PrimitiveRef<TData, K, I>

type ObjectItemRef<
  TData extends Obj,
  K extends keyof TData & string
> = TData[K] extends Array<infer I>
  ? UnionToArray<I> extends [infer _, infer T]
    ? T extends RecordData
      ? ArrayRef<TData, K, T> &
          PrimitiveRef<TData, K, T> &
          ObjectRef<TData, K, T>
      : ArrayItemRef<TData, K, I>
    : ArrayItemRef<TData, K, I>
  : TData[K] extends Obj
  ? PrimitiveRef<TData, K> & ObjectRef<TData, K>
  : PrimitiveRef<TData, K>

export type RefProxy<TData extends Obj> = {
  [K in keyof TData & string]: UnionToArray<TData[K]> extends [infer _, infer T]
    ? T extends RecordData
      ? K
      : ObjectItemRef<TData, K>
    : ObjectItemRef<TData, K>
}

export interface ArrayRef<
  TData extends Obj,
  Key extends string,
  Item extends Obj = GetSerializeValue<TData, Key> extends infer T
    ? T extends Obj
      ? T
      : never
    : never
> extends Ref<TData, Key, Item[]> {
  where(
    condition: (
      constraint: <Field extends keyof Item & string>(
        field: Field,
        comparator: ComparisonOperator,
        value: WhereValue<TData[Field]> | Query<WhereValue<TData[Field]>>
      ) => Where<Item, Field>
    ) => Query<boolean>
  ): Ref<TData, Key>
  where<Field extends keyof Item & string>(
    field: Field,
    comparator: ComparisonOperator,
    value: WhereValue<TData[Field]> | Query<WhereValue<TData[Field]>>
  ): Ref<TData, Key>
}

export interface PrimitiveRef<
  TData extends Obj,
  Key extends string,
  Item = GetSerializeValue<TData, Key>
> extends Ref<TData, Key, Item> {
  is(
    comparator: ComparisonOperator,
    value: Item | null | Item[]
  ): Query<boolean>
}

export type GetSerializeValue<
  TData extends Obj,
  Key extends string
> = Key extends keyof TData
  ? TData[Key]
  : Key extends `${infer P}.${infer C}`
  ? P extends keyof TData
    ? TData[P] extends Obj
      ? GetSerializeValue<TData[P], C>
      : TData[P]
    : never
  : never

export class Ref<
  TData extends Obj,
  Key extends string = string,
  RData = GetSerializeValue<TData, Key>
> extends Query<RData> {
  constructor(key: Key) {
    super(key)
  }
}

export class RefReducer<TData extends RecordData> extends Ref<TData> {
  constructor() {
    super("")
    this.keys = []
    this.values = []
  }

  private keys: string[]
  private values: string[]

  __addKey(key: string) {
    this.keys.push(key)
  }

  toString(): string {
    return `${this.keys.join(".")}${this.values.join(" ")}`
  }

  where(
    field:
      | string
      | ((
          constraint: <Field extends keyof TData & string>(
            field: Field,
            comparator: ComparisonOperator,
            value: TData[Field] extends Array<infer T>
              ? T | T[]
              : TData[Field] | null
          ) => Where<TData, Field>
        ) => Query<boolean>),
    comparator?: string,
    value?: unknown
  ) {
    if (typeof field === "function") {
      const constraint = (
        field: string,
        comparator: ComparisonOperator,
        value: unknown
      ) => new Where(field, comparator, value)
      this.values.push(`[WHERE ${field(constraint)}]`)
    } else {
      this.values.push(`[WHERE ${field} ${comparator} ${safeValue(value)}]`)
    }
    return this
  }

  is(comparator: string, value: unknown) {
    return new Query<boolean>(
      `${this.keys.join(".")} ${comparator} ${safeValue(value)}`
    )
  }
}

export const createRecordRef = <TData extends RecordData>() => {
  const proxy = new Proxy(new RefReducer(), {
    get(target, prop: any, receiver) {
      console.log("🚀 ~ file: index.ts:129 ~ get ~ prop", prop)
      if (target[prop as keyof RefReducer<TData>]) {
        return target[prop as keyof RefReducer<TData>]
      }

      switch (prop) {
        case "toJSON":
        case "toString":
        case Symbol.toPrimitive:
          return () => target.toString()

        default:
          target.__addKey(prop)
          return receiver
      }
    },
  })

  return proxy as unknown as RefProxy<TData>
}
