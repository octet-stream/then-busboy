import {RequestEntityTooLargeError} from "./RequestEntityTooLargeError"

export class FieldSizeLimitError extends RequestEntityTooLargeError {
  constructor(message: string) {
    super(message, "EBUSBOY_FIELD_SIZE_LIMIT")
  }
}
