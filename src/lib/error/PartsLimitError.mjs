import RequestEntityTooLargeError from "./RequestEntityTooLargeError"

class PartsLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message)

    this.code = "EBUSBOY_PARTS_LIMIT"
  }
}

export default PartsLimitError
