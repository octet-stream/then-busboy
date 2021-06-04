import {IncomingMessage} from "http"

import Busboy from "busboy"
import merge from "lodash.merge"

import isPlainObject from "./util/isPlainObject"

import onFile from "./listener/onFile"
import onField from "./listener/onField"
import onFilesLimit from "./listener/onFilesLimit"
import onFieldsLimit from "./listener/onFieldsLimit"
import onPartsLimit from "./listener/onPartsLimit"

import map from "./util/mapListeners"

import {Body, BodyEntries, BodyEntry} from "./Body"

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
      "Expected request argument to be an instance of http.IncomingMessage"
    )
  }

  if (!isPlainObject(options)) {
    throw new TypeError("Options expected to be an object")
  }

  const opts = merge({}, defaults, options, {headers: request.headers})

  const entries: BodyEntries = []
  const parser = new Busboy(opts)

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const listeners = map(initializers, fn => fn(opts, onEntry))

  function unsubscribe() {
    map(listeners, (fn, name) => parser.off(name, fn))
  }

  function onError(error: Error): void {
    unsubscribe()
    reject(error)
  }

  function onFinish(): void {
    unsubscribe()
    resolve(new Body(entries))
  }

  function onEntry(error: Error, entry: BodyEntry): void {
    if (error) {
      return onError(error)
    }

    entries.push(entry)
  }

  map(listeners, (fn, name) => parser.on(name, fn))

  parser
    .once("error", onError)
    .once("finish", onFinish)

  request.pipe(parser)
})
