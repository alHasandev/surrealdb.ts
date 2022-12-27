import { SurrealCore } from "./core"
import { Auth, ScopeAuth } from "./core/auth.types"
import { DatabaseSchema, SurrealSchema } from "./schema.types"
import { SurrealProxy } from "./proxy.types"
import { SurrealDB as ISurrealDB } from "./db.types"
import { SurrealDB } from "./db"
import { QueryBuilder } from "./builder"
import { Query } from "./core/query"
import { Obj } from "./core/data.types"
import { safeValue } from "./core/helpers"
import { InferQuery } from "./builder/reducers/types/exec"
import { SurrealQuery } from "./query"

export class Surreal<Schema extends SurrealSchema> {
  constructor(surreal: SurrealCore) {
    this.core = surreal
    this.db = new SurrealDB(this.core)
  }

  private core: SurrealCore
  private db: SurrealDB<DatabaseSchema>

  query<TData>(query: string) {
    return new SurrealQuery<TData>(this.db, query)
  }

  live<Q extends Query<Obj[]>>(
    query: Q,
    callback: (data: InferQuery<Q>) => void
  ) {
    this.db
      .query(query.toString())
      .then((data) => callback(data as InferQuery<Q>))

    const unsubscribe = () => console.log("actually still not working")

    return unsubscribe
  }

  sql<TData>(strings: TemplateStringsArray, ...vars: any[]) {
    let query = ""

    strings.forEach((string, i) => {
      query += string + (safeValue(vars[i]) || "")
    })

    return new SurrealQuery<TData>(this.db, query)
  }

  use = async <
    NSName extends keyof Schema & string,
    DBName extends keyof Schema[NSName] & string,
    DBSchema extends DatabaseSchema = Schema[NSName][DBName]
  >(
    NS: NSName,
    DB: DBName
  ): Promise<SurrealProxy<ISurrealDB<DBSchema>>> => {
    await this.core.use(NS, DB)

    const proxy = new Proxy(this.db, {
      get: <Prop extends keyof DBSchema & string>(
        target: SurrealDB<DBSchema>,
        prop: Prop
      ) => {
        return new QueryBuilder(target, prop)
      },
    })

    return proxy as SurrealProxy<ISurrealDB<DBSchema>>
  }

  async signin(auth: Auth | string) {
    await this.core.signin(auth)
  }

  async signup(auth: ScopeAuth) {
    return this.core.signup(auth)
  }
}
