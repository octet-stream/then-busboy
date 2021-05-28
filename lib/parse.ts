import {IncomingMessage} from "http"

import ParseOptions from "./ParseOptions"

const defaults: ParseOptions = {
  castTypes: true
}

export const parse = (
  request: IncomingMessage,
  options?: ParseOptions
) => new Promise(() => {})
