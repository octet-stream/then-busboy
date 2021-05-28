export class RequestEntityTooLargeError extends Error {
  readonly status = 413

  readonly code: string

  readonly name: string

  constructor(message: string, code = "EHTTP_REQUEST_ENTITY_TOO_LARGE") {
    super(message)

    this.code = code
    this.name = this.constructor.name

    Error.captureStackTrace(this, Error)
  }
}
