import {RequestEntityTooLargeError} from "./RequestEntityTooLargeError"

export class FileSizeLimitError extends RequestEntityTooLargeError {
  constructor(message: string) {
    super(message, "EBUSBOY_FILE_SIZE_LIMIT")
  }
}
