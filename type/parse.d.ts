import {IncomingMessage} from "http"

import Body from "./Body"

export interface Options extends busboy.Options {
  castTypes?: boolean

  /**
   * @deprecated Use castTypes option instead
   */
  restoreTypes?: boolean
}

export function parse<T extends Record<string, any>>(request: IncomingMessage, options?: Options): Promise<Body<T>>

export default parse
