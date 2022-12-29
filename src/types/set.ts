import type { Query } from "~/core/query"
import type { Obj, QuerifyData } from "~/core/data.types"
import type { Asign, AsignOptions } from "~/entry"
import type { ExecuteQuery } from "./exec"
import type { ParallelReducer } from "./parallel"
import type { TimeoutReducer } from "./timeout"
import type { WhereReducer } from "./where"

export type SetReducer<TData extends Obj> = {
  CREATE: (data: Omit<TData, "id">) => Query<TData[]> & {
    timeout: TimeoutReducer<TData>
    parallel: ParallelReducer<TData>
    exec: ExecuteQuery<TData>
  }
  UPDATE(data: Partial<Omit<TData, "id">>): Query<TData[]> & {
    where: WhereReducer<TData>["UPDATE"]
    timeout: TimeoutReducer<TData>
    parallel: ParallelReducer<TData>
    exec: ExecuteQuery<TData>
  }
  UPDATE(
    setter: (asign: AsignOptions) => {
      [K in keyof TData & string as K extends "id" ? never : K]?:
        | TData[K]
        | Asign<QuerifyData<TData[K]>>
        | QuerifyData<TData[K]>
    }
  ): Query<TData[]> & {
    where: WhereReducer<TData>["UPDATE"]
    timeout: TimeoutReducer<TData>
    parallel: ParallelReducer<TData>
    exec: ExecuteQuery<TData>
  }
}
