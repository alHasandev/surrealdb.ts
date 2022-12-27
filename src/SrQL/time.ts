import { formatRFC3339 } from "date-fns"
import { safeValue } from "~/core/helpers"
import { Query } from "~/core/query"
import { createQueryFunc } from "./helpers"

export type DurationUnit = "ns" | "ms" | "s" | "m" | "h" | "d" | "w"
export type TDuration = `${number}${DurationUnit}`

export type TimeInterval =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "second"

export class Duration extends Query<TDuration> {
  constructor(value: unknown) {
    super(`type::duration(${safeValue(value)})`)
  }
}

export class DateTime extends Query<string> {
  constructor(date?: Date | number | string) {
    if (typeof date === "string") super(date)
    else if (date) super(`"${formatRFC3339(date)}"`)
    else super("time::now()")
  }

  add(duration: TDuration | Query<TDuration>) {
    this._query = `${this._query} + ${duration}`
    return this
  }

  subtract(duration: TDuration | Query<TDuration>) {
    this._query = `${this._query} - ${duration}`
    return this
  }
}

export class Time extends DateTime {
  constructor(date?: Date | number) {
    super(date)
  }

  static day = (datetime: Date | DateTime) => {
    const date =
      datetime instanceof Date ? `"${formatRFC3339(datetime)}"` : datetime
    return createQueryFunc<number>("time::day", date)
  }
  static floor = (datetime: Date, duration: TDuration | Query<TDuration>) =>
    createQueryFunc<string>(
      "time::floor",
      `"${formatRFC3339(datetime)}"`,
      duration
    )
  static group = (datetime: Date | DateTime, interval: TimeInterval) => {
    const date =
      datetime instanceof Date ? `"${formatRFC3339(datetime)}"` : datetime
    return new DateTime(`time::group(${date}, "${interval}")`)
  }
  static hour = (datetime: Date) =>
    createQueryFunc<number>("time::hour", `"${formatRFC3339(datetime)}"`)
  static mins = (datetime: Date) =>
    createQueryFunc<number>("time::mins", `"${formatRFC3339(datetime)}"`)
  static month = (datetime: Date) =>
    createQueryFunc<number>("time::month", `"${formatRFC3339(datetime)}"`)
  static nano = (datetime: Date) =>
    createQueryFunc<number>("time::nano", `"${formatRFC3339(datetime)}"`)
  static now = () => new DateTime()
  static round = (datetime: Date, duration: TDuration | Query<TDuration>) =>
    createQueryFunc<string>(
      "time::round",
      `"${formatRFC3339(datetime)}"`,
      duration
    )
  static secs = (datetime: Date) =>
    createQueryFunc<number>("time::secs", `"${formatRFC3339(datetime)}"`)
  static unix = (datetime: Date) =>
    createQueryFunc<number>("time::unix", `"${formatRFC3339(datetime)}"`)
  static wday = (datetime: Date) =>
    createQueryFunc<number>("time::wday", `"${formatRFC3339(datetime)}"`)
  static week = (datetime: Date) =>
    createQueryFunc<number>("time::week", `"${formatRFC3339(datetime)}"`)
  static yday = (datetime: Date) =>
    createQueryFunc<number>("time::yday", `"${formatRFC3339(datetime)}"`)
  static year = (datetime: Date) =>
    createQueryFunc<number>("time::year", `"${formatRFC3339(datetime)}"`)
}
