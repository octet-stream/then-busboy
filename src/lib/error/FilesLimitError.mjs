import RequestEntityTooLargeError from "lib/error/RequestEntityTooLargeError"

class FilesLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message, "EBUSBOY_FILES_LIMIT")
  }
}

export default FilesLimitError
