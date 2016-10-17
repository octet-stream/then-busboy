class HttpException extends Error
  constructor: (@name = "HttpException", message, @status = 500, code) ->
    @message = message ? "Internal Server Error"
    @code = code ? "EHTTP_INTERNAL_SERVER_ERROR"

    Error.captureStackTrace this, Error

class RequestEntityTooLargeException extends HttpException
  constructor: (message) ->
    super "RequestEntityTooLargeException",
      message ? "Request Entity Too Large", 413, "EHTTP_REQUEST_ENTITY_TOO_LARGE"

class PartsLimitException extends RequestEntityTooLargeException
  constructor: (message) ->
    @code = "EBUSBOY_PARTS_LIMIT"
    super message ? "Parts Limit Reached"

class FieldsLimitException extends RequestEntityTooLargeException
  constructor: (message) ->
    @code = "EBUSBOY_FIELDS_LIMIT"
    super message ? "Fields Limit Reached"

class FilesLimitException extends RequestEntityTooLargeException
  constructor: (message) ->
    @code = "EBUSBOY_FILES_LIMIT"
    super message ? "Files Limit Reached"

module.exports = {
  PartsLimitException
  FieldsLimitException
  FilesLimitException
}
