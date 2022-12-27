import { safeValue } from "~/core/helpers"
import { Query } from "~/core/query"

export function createQueryFunc<TValue>(funcId: string, ...values: unknown[]) {
  const [value] = values
  if (typeof value === "undefined") return new Query<TValue>(`${funcId}()`)

  const safes = values.map((value) => {
    if (typeof value === "object") return safeValue(value)
    return value
  })

  return new Query<TValue>(`${funcId}(${safes.join(", ")})`)
}

export function queryType<TValue>(type: string, value: unknown) {
  return createQueryFunc<TValue>(`type::${type}`, value)
}
