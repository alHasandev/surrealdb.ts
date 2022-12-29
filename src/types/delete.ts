import type { RecordData } from "~/core/data.types"
import type { Query } from "~/core/query"
import type { WhereReducer } from "./where"
import type { ExecuteQuery } from "./exec"

export type DeleteReducer<TData extends RecordData> = (id?: string) => Query<
  TData[]
> & {
  where: WhereReducer<TData>["DELETE"]
  exec: ExecuteQuery<TData>
}
