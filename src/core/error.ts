import { ErrorResponse } from "./response.types"

interface ResponseErrorProps {
  code: number
  details: string
  description?: string
  information?: string
}

export class ResponseError extends Error {
  constructor({ code, details, description, information }: ResponseErrorProps) {
    if (!code || !details) {
      code = 500
      details = "Unknown error!"
    }
    const error: ErrorResponse = {
      code: code as ErrorResponse["code"],
      details,
      description: description || details,
      information: information || description || details,
    }
    super(JSON.stringify(error))
  }

  toJSON() {
    return this.message
  }

  static parse(error: Error) {
    try {
      const message = JSON.parse(error.message)
      return message as ErrorResponse
    } catch (e) {
      return {
        code: 400,
        details: error.message,
        description: error.message,
        information: error.message,
      }
    }
  }
}
