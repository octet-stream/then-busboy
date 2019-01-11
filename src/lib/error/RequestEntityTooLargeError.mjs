class RequestEntityTooLargeError extends Error {
  constructor(message, code = "EHTTP_REQUEST_ENTITY_TOO_LARGE") {
    super(message)

    this.status = 413
    this.code = code

    Error.captureStackTrace(this, Error)
  }
}

export default RequestEntityTooLargeError
