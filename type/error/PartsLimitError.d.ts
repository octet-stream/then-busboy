import RequestEntityTooLargeError from "./RequestEntityTooLargeError";

declare class PartsLimitError extends RequestEntityTooLargeError {
  constructor(message: string)
}

export default PartsLimitError
