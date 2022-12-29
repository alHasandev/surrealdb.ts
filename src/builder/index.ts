import type {
  Obj,
  PartialID,
  QuerifyData,
  RecordData,
  SetData,
} from "../core/data.types"
import type { SurrealDB } from "../db.types"
import type { SelectFields } from "../select.types"
import type { DatabaseSchema } from "../schema.types"
import { QueryReducer } from "../reducers"
import { ResponseError } from "../core/error"
import { CreateReducer } from "../types/create"
import { UpdateReducer } from "../types/update"
import { Query } from "../core/query"
import { RefProxy } from "../ref"

export class QueryBuilder<
  DB extends SurrealDB<DatabaseSchema>,
  TableName extends keyof DBSchema & string,
  DBSchema extends DatabaseSchema = DB extends SurrealDB<infer DBSchema>
    ? DBSchema
    : DatabaseSchema,
  TData extends RecordData = TableName extends keyof DBSchema
    ? DBSchema[TableName]
    : RecordData
> extends QueryReducer<TData, TableName> {
  constructor(db: DB, table: TableName) {
    super(table)
    this.db = db
  }

  protected db: DB

  async exec() {
    const result = await this.db.query<TData>(`${this}`)

    return result
  }

  select<Fields extends SelectFields<TData>, FieldAs extends Obj = {}>(
    fields: Fields,
    fieldAs?: (ref: RefProxy<TData>) => FieldAs
  ) {
    this.statement = "SELECT"
    this.options.statement = "SELECT"
    return this.proxy().select(fields, fieldAs?.(this.ref))
  }

  async getAll() {
    this.statement = "SELECT"
    this.options.statement = "SELECT"
    return this.proxy().select(["*"]).exec()
  }

  async getOne() {
    this.statement = "SELECT"
    this.options.statement = "SELECT"
    const [result] = await this.proxy().select(["*"]).limit(1).exec()
    if (typeof result === "undefined")
      throw new ResponseError({
        code: 404,
        details: `${this.table} data is not found`,
      })

    return result
  }

  create(): Omit<ReturnType<CreateReducer<TData>>, "exec">
  create(id: string): Omit<ReturnType<CreateReducer<TData>>, "exec">
  create(
    data: QuerifyData<PartialID<TData>>
  ): Omit<ReturnType<CreateReducer<TData>>, "set">
  create(idOrData?: string | QuerifyData<PartialID<TData>>) {
    this.statement = "CREATE"
    this.options.statement = "CREATE"

    return this.proxy().create(idOrData)
  }

  update(): Omit<ReturnType<UpdateReducer<TData>>, "exec">
  update(id: string): Omit<ReturnType<UpdateReducer<TData>>, "exec">
  update(
    data: Partial<QuerifyData<SetData<TData>>>
  ): Omit<ReturnType<UpdateReducer<TData>>, "set">
  update(idOrData?: string | Partial<QuerifyData<SetData<TData>>>) {
    this.statement = "UPDATE"
    this.options.statement = "UPDATE"

    return this.proxy().update(idOrData)
  }

  insert(dataset: PartialID<TData>[] | Query<PartialID<TData>[]>) {
    this.statement = "INSERT"
    this.options.statement = "INSERT"

    return this.proxy().insert(dataset)
  }

  delete(id?: string) {
    this.statement = "DELETE"
    this.options.statement = "DELETE"

    return this.proxy().delete(id)
  }
}
