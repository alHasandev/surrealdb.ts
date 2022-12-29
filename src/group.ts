import { Query } from "./core/query"

export class Group<
  Q extends string | Query,
  Value = Q extends Query<infer T> ? T : unknown
> extends Query<Value> {
  constructor(query: Q) {
    super(`(${query})`)
  }

  and(query: Q) {
    this._query += ` AND (${query})`
    return this as Query<boolean>
  }

  or(query: Q) {
    this._query += ` OR (${query})`
    return this as Query<boolean>
  }
}
