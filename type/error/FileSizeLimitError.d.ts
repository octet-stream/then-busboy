import RequestEntityTooLargeError from "./RequestEntityTooLargeError";

declare class FileSizeLimitError extends RequestEntityTooLargeError { }

export default FileSizeLimitError
