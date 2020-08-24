const RequestEntityTooLargeError = require("./RequestEntityTooLargeError")

class FileSizeLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message, "EBUSBOY_FILE_SIZE_LIMIT")
  }
}

module.exports = FileSizeLimitError
