import { Options } from "../options.types"
import { lastReducer } from "./last"
import { whereReducer } from "./where"

export function deleteReducer(table: string, options: Options) {
  let id = ""
  if (options.delete) {
    const [deleteId] = options.delete
    id = deleteId ? `:${deleteId}` : ""
  }

  const opts = whereReducer(options.where)

  return `DELETE FROM ${table}${id} ${opts.join(" ")} ${lastReducer(options)}`
}
