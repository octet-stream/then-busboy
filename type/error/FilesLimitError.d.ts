import RequestEntityTooLargeError from "./RequestEntityTooLargeError";

declare class FilesLimitError extends RequestEntityTooLargeError { }

export default FilesLimitError
