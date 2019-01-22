import RequestEntityTooLargeError from "lib/error/RequestEntityTooLargeError"

class FieldSizeLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message, "EBUSBOY_FIELD_SIZE_LIMIT")
  }
}

export default FieldSizeLimitError
