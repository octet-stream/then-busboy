import RequestEntityTooLargeError from "lib/error/RequestEntityTooLargeError"

class FileSizeLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message, "EBUSBOY_FILE_SIZE_LIMIT")
  }
}

export default FileSizeLimitError
