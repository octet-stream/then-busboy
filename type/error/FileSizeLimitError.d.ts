import RequestEntityTooLargeError from "./RequestEntityTooLargeError";

declare class FileSizeLimitError extends RequestEntityTooLargeError {
  constructor(message: string)
}

export default FileSizeLimitError
