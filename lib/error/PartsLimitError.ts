import {RequestEntityTooLargeError} from "./RequestEntityTooLargeError"

export class PartsLimitError extends RequestEntityTooLargeError {
  constructor(message: string) {
    super(message, "EBUSBOY_PARTS_LIMIT")
  }
}
