import RequestEntityTooLargeError from "./RequestEntityTooLargeError";

declare class FieldsLimitError extends RequestEntityTooLargeError { }

export default FieldsLimitError
