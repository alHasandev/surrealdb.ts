import { ErrorResponse } from "./response.types"

export interface RootAuth {
  user: string
  pass: string
}
export interface NamespaceAuth {
  NS: string
  user: string
  pass: string
}
export interface DatabaseAuth {
  NS: string
  DB: string
  user: string
  pass: string
}
export interface ScopeAuth {
  NS: string
  DB: string
  SC: string
  [key: string]: unknown
}
export declare type Auth = RootAuth | NamespaceAuth | DatabaseAuth | ScopeAuth

export interface AuthType {
  RootAuth: RootAuth
  NamespaceAuth: NamespaceAuth
  DatabaseAuth: DatabaseAuth
  ScopeAuth: ScopeAuth
}

export interface SucceedAuthResult {
  code: 200
  details: string
  token: string
}

export type AuthResult = SucceedAuthResult | ErrorResponse
