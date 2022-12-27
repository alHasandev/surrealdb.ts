export interface Stringifiable {
  toString(): string
}

export class Query<QueryResult = unknown> implements Stringifiable {
  constructor(query?: string | Stringifiable) {
    this._query = query ? `${query}` : ""
  }

  protected _query: string

  async exec(
    executor: (query: string) => Promise<QueryResult>
  ): Promise<QueryResult> {
    return executor(this._query)
  }

  toString(): string {
    return this._query
  }

  toJSON(): string {
    return this.toString()
  }
}
