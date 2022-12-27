import { TObj } from "~/core/utils.types"
import { ErrorResponse } from "./response.types"
import { Auth, ScopeAuth } from "./auth.types"
import { QueryResponse } from "./response.types"

export interface SurrealCore {
  query<TResponse extends [QueryResponse<any>]>(
    q: string,
    vars?: TObj
  ): Promise<TResponse | ErrorResponse>
  use(NS: string, DB: string): Promise<void>
  signin(auth: Auth | string): Promise<string | undefined>
  signup(auth: ScopeAuth): Promise<string>
}
