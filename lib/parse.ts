import {IncomingMessage} from "http"

import Busboy from "busboy"
import merge from "lodash.merge"

import onFile from "./listener/onFile"
import onField from "./listener/onField"
import onFilesLimit from "./listener/onFilesLimit"
import onFieldsLimit from "./listener/onFieldsLimit"
import onPartsLimit from "./listener/onPartsLimit"

import isPlainObject from "./util/isPlainObject"
import map from "./util/mapListeners"

import {BodyEntries} from "./BodyEntries"
import {Body} from "./Body"

// eslint-disable-next-line no-undef
export interface ParseOptions extends busboy.BusboyConfig {
  /**
   * Indicates whether then-busboy should cast fields values to their initial type
   */
  castTypes?: boolean
}

const initializers = {
  onFile,
  onField,
  onFilesLimit,
  onFieldsLimit,
  onPartsLimit
}

const defaults: ParseOptions = {
  castTypes: true
}

export const parse = (
  request: IncomingMessage,
  options: ParseOptions = {}
) => new Promise<Body>((resolve, reject) => {
  if (!(request instanceof IncomingMessage)) {
    throw new TypeError(
      "Expected request argument to be an instance of http.IncomingMessage."
    )
  }

  if (!isPlainObject(options)) {
    throw new TypeError("Expected options argument to be an object.")
  }

  const opts = merge({}, defaults, options, {headers: request.headers})

  const parser = new Busboy(opts)
  const entries = new BodyEntries()

  const listeners = map(initializers, fn => fn(opts, entries))

  function unsubscribe() {
    map(listeners, (fn, name) => parser.off(name, fn))
  }

  function onError(error: Error): void {
    unsubscribe()
    reject(error)
  }

  entries.once("finish", body => {
    unsubscribe()
    resolve(body)
  })

  const onBodyRead = () => entries.finish(true)

  map(listeners, (fn, name) => parser.on(name, fn))

  entries.once("error", onError)

  parser
    .once("error", onError)
    .once("finish", onBodyRead)

  request.pipe(parser)
})
