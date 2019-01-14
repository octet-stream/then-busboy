import RequestEntityTooLargeError from "lib/error/RequestEntityTooLargeError"

class FieldsLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message, "EBUSBOY_FIELDS_LIMIT")
  }
}

export default FieldsLimitError
