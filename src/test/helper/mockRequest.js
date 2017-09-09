import {Socket} from "net"
import {IncomingMessage} from "http"

import mockHeader from "./mockHeader"

function mockRequest() {
  const req = new IncomingMessage(new Socket({readeble: true}))

  req.headers["content-type"] = mockHeader
  req.method = "POST"

  return req
}

export default mockRequest
