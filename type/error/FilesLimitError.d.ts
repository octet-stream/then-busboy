import RequestEntityTooLargeError from "./RequestEntityTooLargeError";

declare class FilesLimitError extends RequestEntityTooLargeError {
  constructor(message: string)
}

export default FilesLimitError
