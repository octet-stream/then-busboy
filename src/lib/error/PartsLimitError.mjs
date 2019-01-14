import RequestEntityTooLargeError from "lib/error/RequestEntityTooLargeError"

class PartsLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message, "EBUSBOY_PARTS_LIMIT")
  }
}

export default PartsLimitError
