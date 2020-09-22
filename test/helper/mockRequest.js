const {IncomingMessage} = require("http")
const {Socket} = require("net")

const mockHeader = require("./mockHeader")

function mockRequest() {
  const req = new IncomingMessage(new Socket())

  req.headers["content-type"] = mockHeader
  req.method = "POST"

  return req
}

module.exports = mockRequest
