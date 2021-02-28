import {IncomingMessage} from "http"

export interface ThenBusboyOptions extends busboy.Options {
  castTypes: boolean
}

export function parse(request: IncomingMessage): Promise<Record<string, any>>

export default parse
