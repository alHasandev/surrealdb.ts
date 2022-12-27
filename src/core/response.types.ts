export interface QueryOK<TData> {
  status: "OK"
  time: string
  result: TData[]
}

export interface QueryERR {
  status: "ERR"
  time: string
  detail: string
}

export type ErrorResponse = {
  code: 400 | 401 | 402 | 403 | 404 | 405
  details: string
  description: string
  information: string
}

export type QueryResponse<TData> = QueryOK<TData> | QueryERR
