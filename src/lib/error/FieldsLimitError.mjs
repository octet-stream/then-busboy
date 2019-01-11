import RequestEntityTooLargeError from "./RequestEntityTooLargeError"

class FieldsLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message)

    this.code = "EBUSBOY_FIELDS_LIMIT"
  }
}

export default FieldsLimitError
