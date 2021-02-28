import {IncomingMessage} from "http"

import Body from "./Body"

export interface ThenBusboyOptions extends busboy.Options {
  castTypes: boolean
}

export function parse(request: IncomingMessage): Promise<Body>

export default parse
