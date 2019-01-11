class RequestEntityTooLargeError extends Error {
  constructor(message, code = "EHTTP_REQUEST_ENTITY_TOO_LARGE") {
    super(message)

    this.status = 413
    this.code = code
    this.name = this.constructor.name

    Error.captureStackTrace(this, Error)
  }
}

export default RequestEntityTooLargeError
