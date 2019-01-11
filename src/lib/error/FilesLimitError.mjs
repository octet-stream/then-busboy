import RequestEntityTooLargeError from "./RequestEntityTooLargeError"

class FilesLimitError extends RequestEntityTooLargeError {
  constructor(message) {
    super(message)

    this.code = "EBUSBOY_FILES_LIMIT"
  }
}

export default FilesLimitError
