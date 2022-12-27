import { TObj } from "~/core/utils.types"
import { Query } from "./query"

export const surrealQuery = (query: string, vars?: TObj) => {
  const statements: string[] = []
  if (vars) {
    Object.keys(vars).map((key) => {
      query = query.replace(`$${key}`, `${safeValue(vars[key])}`)
    })
  }

  statements.push(query)

  return statements.join(";\n")
}

export const safeValue = (value: any): string => {
  if (value === null) return value
  if (value === undefined) return ""
  if (value instanceof Query) return value.toString()
  if (typeof value === "string") {
    const matchSurrealFunc = /([A-Z])\w+\(.*\)+/gi
    if (value.match(matchSurrealFunc)) return value
    return `"${value}"`
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      const values: string[] = value.map((val) => safeValue(val))
      return `[${values.join(", ")}]`
    }
    const values: string[] = Object.entries(value).map(
      ([key, value]) => `${key}: ${safeValue(value)}`
    )
    return `{${values.join(", ")}}`
  }

  if (typeof value === "function") {
    return value()
  }

  return value
}
