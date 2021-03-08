import RequestEntityTooLargeError from "./RequestEntityTooLargeError";

declare class FieldsLimitError extends RequestEntityTooLargeError {
  constructor(message: string)
}

export default FieldsLimitError
