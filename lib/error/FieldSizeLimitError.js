const RequestEntityTooLargeError = require("./RequestEntityTooLargeError")

class FieldSizeLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message, "EBUSBOY_FIELD_SIZE_LIMIT")
  }
}

module.exports = FieldSizeLimitError
