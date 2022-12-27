export type TObj = Record<string, unknown>

export type Json<Value = null> = {
  [Key: string]:
    | null
    | string
    | number
    | boolean
    | Json
    | Value
    | Array<string>
    | Array<number>
    | Array<boolean>
    | Array<Json>
    | Array<Value>
}

export type FilterString<T extends readonly unknown[]> = T extends []
  ? []
  : T extends [infer H, ...infer R]
  ? H extends string
    ? FilterString<R>
    : [H, ...FilterString<R>]
  : T

export type GetOnlyRecordData<T extends readonly unknown[]> = T extends []
  ? []
  : T extends [infer H, ...infer R]
  ? H extends TObj[] | TObj
    ? H
    : GetOnlyRecordData<R>
  : never

// credits goes to https://stackoverflow.com/a/50375286
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

// Converts union to overloaded function
export type UnionToOvlds<U> = UnionToIntersection<
  U extends any ? (f: U) => void : never
>

export type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void
  ? A
  : never

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true

// Finally me)
export type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A]

export type ArrayToUnion<Arr extends Array<any> | readonly any[]> = Arr[number]

export type ArrayTrims<
  S extends Array<string>,
  A extends Array<any> = UnionToArray<
    keyof {
      [K in S[number] as K extends "" ? never : K]: boolean
    }
  >
> = A extends [never] ? [] : A

export type ArrayJoin<
  A extends readonly (string | number)[],
  Separator extends string = ", ",
  Accumulator extends string = ""
> = A extends [infer I, ...infer R]
  ? I extends string | number
    ? Accumulator extends ""
      ? R extends (string | number)[]
        ? ArrayJoin<R, Separator, `${I}`>
        : I
      : R extends (string | number)[]
      ? ArrayJoin<R, Separator, `${Accumulator}${Separator}${I}`>
      : `${Accumulator}${Separator}${I}`
    : Accumulator
  : Accumulator

export type SerializeKeys<
  Obj extends TObj,
  K extends keyof Obj,
  I extends keyof Obj[K] | undefined = undefined
> = keyof (Record<K, boolean> &
  (I extends keyof Obj[K]
    ? {
        [F in keyof Obj[K][I] as K extends string
          ? F extends string
            ? `${K}.${F}`
            : F
          : F]: boolean
      }
    : {
        [F in keyof Obj[K] as K extends string
          ? F extends string
            ? `${K}.${F}`
            : F
          : F]: boolean
      }))

export type SerializeObject<Obj extends TObj> = {
  [K in keyof Obj as Obj[K] extends TObj
    ? SerializeKeys<Obj, K>
    : Obj[K] extends TObj[]
    ? number extends keyof Obj[K]
      ? Obj[K][number] extends TObj
        ? SerializeKeys<Obj, K, number>
        : K
      : K
    : Obj[K] extends string[] | TObj[]
    ? K
    : Obj[K] extends string | TObj
    ? Obj[K] extends string
      ? K
      : K
    : K]: boolean
}

export type NestedPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, any>
    ? NestedPartial<T[P]>
    : T[P] extends Array<infer I>
    ? I extends Record<string, any>
      ? Array<NestedPartial<T>>
      : Array<I>
    : T[P]
}

export type InferSerializedProp<
  TData extends TObj,
  S extends keyof TData
> = S extends `${infer P}.${infer N}`
  ? P extends keyof TData
    ? N extends keyof TData[P]
      ? TData[P][N]
      : TData[S]
    : never
  : S extends keyof TData
  ? TData[S]
  : never

export type PickByValue<TData extends Record<string, unknown>, Value> = Pick<
  TData,
  {
    [K in keyof TData]: TData[K] extends infer T
      ? T extends Value
        ? K
        : never
      : never
  }[keyof TData]
>
