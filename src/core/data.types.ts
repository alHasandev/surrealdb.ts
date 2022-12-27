import { Query } from "./query"
import { UnionToArray } from "./utils.types"

export type Obj = {
  [K: string]: unknown
}

export type RecordData = {
  id: string
  [Field: string]: unknown
}

export type SetData<TData extends RecordData> = Omit<TData, "id">

export type PartialID<TData extends RecordData> = SetData<TData> & {
  id?: string
}

export type QuerifyData<TData> = TData extends Obj
  ? {
      [K in keyof TData & string]: TData[K] extends infer T
        ? T extends Array<infer I>
          ? I extends Obj
            ? QuerifyData<I>[]
            : I[] | Query<I[]>
          : T extends Obj
          ? QuerifyData<T>
          : T | Query<T>
        : never
    }
  : Query<TData>

export type RecordRef<TData extends RecordData> = TData | TData["id"]

export type InferRef<
  Ref extends RecordRef<RecordData>,
  TData extends RecordData = UnionToArray<Ref> extends [infer _ID, infer T]
    ? T extends RecordData
      ? T
      : never
    : never
> = TData
