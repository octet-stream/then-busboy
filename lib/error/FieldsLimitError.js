const RequestEntityTooLargeError = require("./RequestEntityTooLargeError")

class FieldsLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message, "EBUSBOY_FIELDS_LIMIT")
  }
}

module.exports = FieldsLimitError
