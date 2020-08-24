import net from "net"
import http from "http"

import mockHeader from "./mockHeader"

function mockRequest() {
  const req = new http.IncomingMessage(new net.Socket())

  req.headers["content-type"] = mockHeader
  req.method = "POST"

  return req
}

export default mockRequest
