import {Socket} from "net"
import {IncomingMessage} from "http"

import mockHeader from "./mockHeader"

const mockRequest = new IncomingMessage(new Socket({readeble: true}))

mockRequest.headers = {"content-type": mockHeader}
mockRequest.method = "POST"

export default mockRequest
