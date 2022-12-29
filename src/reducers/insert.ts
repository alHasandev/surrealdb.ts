import { ResponseError } from "../core/error"
import { Query } from "../core/query"
import { InsertOptions } from "../builder/options.types"
import { lastReducer } from "./last"

export function insertReducer(table: string, options: InsertOptions) {
  const insertQueries = [`INSERT INTO ${table}`]

  if (!options.insert)
    throw new ResponseError({
      code: 400,
      details: "Insert value must provided",
    })

  const [values] = options.insert

  if (values instanceof Query) {
    insertQueries.push(`(${values})`)
  } else {
    const keys = values[0] ? Object.keys(values[0]) : []
    insertQueries.push(`(${keys.join(", ")})`)
    const contents = values.map((obj) => {
      return `(${keys.map((key) => obj[key]).join(", ")})`
    })

    insertQueries.push(`VALUES ${contents.join(", ")}`)
  }

  return `${insertQueries.join(" ")} ${lastReducer(options)}`
}
