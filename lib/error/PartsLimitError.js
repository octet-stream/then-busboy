const RequestEntityTooLargeError = require("./RequestEntityTooLargeError")

class PartsLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message, "EBUSBOY_PARTS_LIMIT")
  }
}

module.exports = PartsLimitError
