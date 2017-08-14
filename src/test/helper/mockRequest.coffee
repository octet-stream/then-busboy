{Socket} = require "net"
{IncomingMessage} = require "http"

mockHeader = require "./mockHeader"

mockRequest = do ->
  req = new IncomingMessage new Socket readeble: on

  req.headers = "content-type": mockHeader
  req.method = "POST"

  return req

module.exports = mockRequest
