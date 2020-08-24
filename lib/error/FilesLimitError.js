const RequestEntityTooLargeError = require("./RequestEntityTooLargeError")

class FilesLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message, "EBUSBOY_FILES_LIMIT")
  }
}

module.exports = FilesLimitError
