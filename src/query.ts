import { ResponseError } from "./core/error"
import { Query } from "./core/query"
import { SurrealDB } from "./db"
import { DatabaseSchema } from "./schema.types"

export class SurrealQuery<TValue> extends Query<TValue[]> {
  constructor(db: SurrealDB<DatabaseSchema>, query: string) {
    super(query)
    this.db = db
  }

  private db: SurrealDB<DatabaseSchema>

  async exec() {
    const query = this.toString()
    const data = await this.db.query<TValue>(query)
    if (data === null)
      throw new ResponseError({
        code: 404,
        details: `(${query}) query returning null instead of array of item`,
        information: `NULL RESPONSE`,
      })

    return data
  }

  toJSON() {
    return this.toString()
  }
}
