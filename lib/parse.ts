import {IncomingMessage} from "http"

import ParseOptions from "./ParseOptions"

const defaults = {}

export const parse = (
  request: IncomingMessage,
  options?: ParseOptions
) => new Promise(() => {})
