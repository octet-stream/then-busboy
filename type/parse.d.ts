import {IncomingMessage} from "http"

import Body from "./Body"

export interface ThenBusboyOptions extends busboy.Options {
  castTypes?: boolean

  /**
   * @deprecated Use castTypes option instead
   */
  restoreTypes?: boolean
}

export function parse<T extends Record<string, any>>(request: IncomingMessage): Promise<Body<T>>

export default parse
