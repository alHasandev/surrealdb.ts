import { safeValue } from "../core/helpers"
import { Query } from "~/core/query"
import { Obj } from "~/core/data.types"

export class SurrealObject<TData extends Obj | Obj[]> extends Query<TData> {
  constructor(object: TData) {
    super(safeValue(object))
  }
}
