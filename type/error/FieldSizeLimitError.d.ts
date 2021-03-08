import RequestEntityTooLargeError from "./RequestEntityTooLargeError";

declare class FieldSizeLimitError extends RequestEntityTooLargeError { }

export default FieldSizeLimitError
