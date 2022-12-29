import { ResponseError } from "../core/error"
import { getProjections } from "../projections"
import { Options } from "../builder/options.types"
import { lastReducer } from "./last"
import { whereReducer } from "./where"

export const selectReducer = (table: string, options: Options) => {
  if (!options.select)
    throw new ResponseError({
      code: 400,
      details: "Select statement must specify @projections (minimal *)",
    })

  const [selects, selectAs] = options.select
  const projections = getProjections(selects, selectAs)

  const constraints = options.where ? whereReducer(options.where) : []

  if (options.splitAt) {
    const [splitFields] = options.splitAt
    if (splitFields.length > 0)
      constraints.push(`SPLIT ${splitFields.join(", ")}`)
  }

  if (options.groupBy) {
    const [groupFields] = options.groupBy
    if (groupFields.length > 0)
      constraints.push(`GROUP BY ${groupFields.join(", ")}`)
  }

  if (options.orderBy) {
    const [orderBy] = options.orderBy
    const orders = Object.entries(orderBy).map(([key, value]) => {
      return `${key} ${value}`
    })
    if (orders.length > 0) constraints.push(`ORDER BY ${orders.join(", ")}`)
  }

  if (options.limit) {
    const [limitBy] = options.limit
    if (limitBy > 0) constraints.push(`LIMIT ${limitBy}`)
  }

  if (options.startAt) {
    const [startAt] = options.startAt
    if (startAt > 0) constraints.push(`START ${startAt}`)
  }

  if (options.fetch) {
    const [fetchKeys] = options.fetch

    if (fetchKeys.length > 0) constraints.push(`FETCH ${fetchKeys.join(", ")}`)
  }

  const query = `SELECT ${projections.join(
    ", "
  )} FROM ${table} ${constraints.join(" ")} ${lastReducer(options)}`

  return query
}
