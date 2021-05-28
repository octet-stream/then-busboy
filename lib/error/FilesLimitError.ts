import {RequestEntityTooLargeError} from "./RequestEntityTooLargeError"

export class FilesLimitError extends RequestEntityTooLargeError {
  constructor(message: string) {
    super(message, "EBUSBOY_FILES_LIMIT")
  }
}
