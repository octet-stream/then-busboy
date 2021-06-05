import {IncomingMessage} from "http"
import {EventEmitter} from "events"

import type TypedEmitter from "typed-emitter"

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

interface ParserEvents extends EventEmitter {
  finish(): void
  error(error: Error): void
  "entry:push"(entry: BodyEntry): void
  "entry:register"(): void
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

  const parser = new Busboy(opts)

  const ee = new EventEmitter() as TypedEmitter<ParserEvents>
  const entries: BodyEntries = []
  let isBodyRead = false
  let entriesLeft = 0

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  // const listeners = map(initializers, fn => fn(opts, onEntry))
  const listeners = map(initializers, fn => fn(opts, ee))

  function unsubscribe() {
    map(listeners, (fn, name) => parser.off(name, fn))
  }

  function onError(error: Error): void {
    unsubscribe()
    reject(error)
  }

  ee.on("finish", () => {
    if (isBodyRead && entriesLeft <= 0) {
      unsubscribe()
      resolve(new Body(entries))
    }
  })

  ee.on("entry:register", () => { ++entriesLeft })

  ee.on("entry:push", entry => {
    entries.push(entry)

    if ((--entriesLeft) <= 0) {
      ee.emit("finish")
    }
  })

  function onBodyRead() {
    isBodyRead = true

    ee.emit("finish")
  }

  map(listeners, (fn, name) => parser.on(name, fn))

  ee.once("error", onError)

  parser
    .once("error", onError)
    .once("finish", onBodyRead)

  request.pipe(parser)
})
