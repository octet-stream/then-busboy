import RequestEntityTooLargeError from "./RequestEntityTooLargeError";

declare class FieldSizeLimitError extends RequestEntityTooLargeError {
  constructor(message: string)
}

export default FieldSizeLimitError
