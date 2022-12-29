import type { WhereFunction } from "~/where/types"
import type { Obj, RecordData } from "~/core/data.types"
import type { Query } from "~/core/query"
import type { Select } from "~/select.types"
import type { FetchReducer } from "./fetch"
import type { GroupByReducer } from "./groupBy"
import type { LimitReducer } from "./limit"
import type { OrderByReducer } from "./orderBy"
import type { ParallelReducer } from "./parallel"
import type { StartReducer } from "./start"
import type { TimeoutReducer } from "./timeout"
import type { ExecuteQuery } from "./exec"

export type WhereReducer<
  TData extends Obj,
  RData extends RecordData = TData extends Select<infer T, infer S>
    ? T extends RecordData
      ? T
      : TData extends RecordData
      ? TData
      : never
    : TData extends RecordData
    ? TData
    : never
> = {
  SELECT: WhereFunction<
    RData,
    Query<TData[]> & {
      splitAt(): void
      groupBy: GroupByReducer<TData>
      orderBy: OrderByReducer<TData>
      limit: LimitReducer<TData>
      start: StartReducer<TData>
      fetch: FetchReducer<TData>
      timeout: TimeoutReducer<TData>
      parallel: ParallelReducer<TData>
      exec: ExecuteQuery<TData>
    }
  >
  UPDATE: WhereFunction<
    RData,
    Query<TData[]> & {
      timeout: TimeoutReducer<TData>
      parallel: ParallelReducer<TData>
      exec: ExecuteQuery<TData>
    }
  >
  DELETE: WhereFunction<
    RData,
    Query<TData[]> & {
      timeout: TimeoutReducer<TData>
      parallel: ParallelReducer<TData>
      exec: ExecuteQuery<TData>
    }
  >
}
