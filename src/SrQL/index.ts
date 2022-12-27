import { Group } from "~/builder/group"
import { safeValue } from "~/core/helpers"
import { Query } from "~/core/query"
import { createQueryFunc, queryType } from "./helpers"
import { Duration, Time } from "./time"

export class SurrealType<Type extends string> {
  constructor(type: Type) {
    this.type = type
  }

  type: Type
}

export class Point extends SurrealType<"Point"> {
  constructor(longtitude: number, latitude: number) {
    super("Point")
    this.coordinates = [longtitude, latitude]
  }

  readonly coordinates: readonly [number, number]
}

export class Thing<
  TableName extends string,
  ID
> extends Query<`${TableName}:${string}`> {
  constructor(table: TableName, id: ID) {
    if (typeof id === "object" || typeof id === "function")
      super(`${table}:${safeValue(id)}`)
    super(`${table}:${id}`)
    this.tableName = table
    this.id = id
  }

  id: ID
  tableName: TableName

  async exec() {
    return `${this.tableName}:${safeValue(this.id)}` as const
  }
}

export class SrQL {
  static group = <Q extends Query>(query: Q) => new Group(query)

  static rand = {
    init: () => new Query<number>("rand()"),
    guid(len?: number) {
      if (!len) return new Query<string>("rand::guid()")

      return new Query<string>(`rand::guid(${len})`)
    },
  }

  static time = Time

  static count = (value?: unknown) => createQueryFunc<number>(`count`, value)

  static type = {
    bool: (value: unknown) => queryType<boolean>("bool", value),
    datetime: (value: unknown) => queryType<string>("datetime", value),
    float: (value: unknown) => queryType<number>("float", value),
    int: (value: unknown) => queryType<number>("int", value),
    number: (value: unknown) => queryType<number>("number", value),
    /**
     *
     * @param value string of duration type (any number followed by duration unit: ns, ms, s, m, h, d, w)
     * @returns Query of TDuration
     */
    duration(value: string) {
      return new Duration(value)
    },
    point: (longtitute: number, latitude: number) =>
      queryType<Point>("point", [longtitute, latitude]),
    string: (value: unknown) => queryType<string>("string", value),
    thing: <TableName extends string, ID>(table: TableName, id: ID) =>
      createQueryFunc<Thing<TableName, ID>>("type::thing", table, id),
  }

  static array = {
    combine: <ItemA, ItemB>(itemsA: ItemA[], itemsB: ItemB[]) =>
      createQueryFunc<(ItemA | ItemB)[][]>("array::combine", itemsA, itemsB),
    concat: <ItemA, ItemB>(itemsA: ItemA[], itemsB: ItemB[]) =>
      createQueryFunc<(ItemA | ItemB)[]>("array::concat", itemsA, itemsB),
    difference: <ItemA, ItemB>(itemsA: ItemA[], itemsB: ItemB[]) =>
      createQueryFunc<(ItemA | ItemB)[]>("array::difference", itemsA, itemsB),
    distinct: <Item>(items: Item[]) =>
      createQueryFunc<Item[]>("array::distinct", items),
    intersect: <ItemA, ItemB>(itemsA: ItemA[], itemsB: ItemB[]) =>
      createQueryFunc<(ItemA | ItemB)[]>("array::intersect", itemsA, itemsB),
    len: <Item>(items: Item[]) => createQueryFunc<number>("array::len", items),
    sort: <Item>(items: Item[], order: "asc" | "desc") =>
      createQueryFunc<Item[]>("array::sort", items, `"${order}"`),
    union: <ItemA, ItemB>(itemsA: ItemA[], itemsB: ItemB[]) =>
      createQueryFunc<(ItemA | ItemB)[]>("array::union", itemsA, itemsB),
  }
}
