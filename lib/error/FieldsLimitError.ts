import {RequestEntityTooLargeError} from "./RequestEntityTooLargeError"

export class FieldsLimitError extends RequestEntityTooLargeError {
  constructor(message: string) {
    super(message, "EBUSBOY_FIELDS_LIMIT")
  }
}
