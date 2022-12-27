import { Obj } from "~/core/data.types"
import { ComparisonOperator } from "~/operator.types"
import { Query } from "~/core/query"
import { safeValue } from "~/core/helpers"
import { WhereValue } from "./types"

export function whereToString(
  field: string,
  comparator: string,
  value: unknown
) {
  return `${field} ${comparator} ${safeValue(value)}`
}

export class Where<
  TData extends Obj,
  Field extends keyof TData & string = keyof TData & string
> extends Query<boolean> {
  constructor(
    field: Field,
    comparator: ComparisonOperator,
    value: WhereValue<TData[Field]>
  ) {
    super(whereToString(field, comparator, value))
  }

  and<Field extends keyof TData & string>(
    field: Field,
    comparator: ComparisonOperator,
    value: WhereValue<TData[Field]>
  ) {
    this._query += ` AND ${whereToString(field, comparator, value)}`
    return this
  }

  or<Field extends keyof TData & string>(
    field: Field,
    comparator: ComparisonOperator,
    value: WhereValue<TData[Field]>
  ) {
    this._query += ` OR ${whereToString(field, comparator, value)}`
    return this
  }
}
