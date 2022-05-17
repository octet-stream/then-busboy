import type {IncomingHttpHeaders} from "node:http"
import {IncomingMessage} from "node:http"
import {Readable} from "node:stream"

import busboy from "busboy"
import merge from "lodash.merge"

import onFile from "./listener/onFile.js"
import onField from "./listener/onField.js"
import onFilesLimit from "./listener/onFilesLimit.js"
import onFieldsLimit from "./listener/onFieldsLimit.js"
import onPartsLimit from "./listener/onPartsLimit.js"

import isPlainObject from "./util/isPlainObject.js"
import isAsyncIterable from "./util/isAsyncIterable.js"
import map from "./util/mapListeners.js"

import {BodyEntries} from "./BodyEntries.js"
import {Body} from "./Body.js"

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

/**
 * Parses `multipart/form-data` body and returns an object with the data of that body
 *
 * @param request HTTP IncomingMessage object
 * @param options Parser options
 *
 * Simplest usage example:
 *
 * ```js
 * import {createServer} from "http"
 * import {parse} from "then-busboy"
 *
 * const handler = (req, res) => parse(req)
 *   .then(async body => {
 *     const result = []
 *
 *     for (const [path, value] of body) {
 *       result.push([path, isFile(value) ? await value.text() : value])
 *     }
 *
 *     res.setHeader("Content-Type", "application/json")
 *     res.end(JSON.stringify(Body.json(result)))
 *   })
 *   .catch(error => {
 *     res.statusCode = error.status || 500
 *     res.end(error.message)
 *   })
 *
 * createServer(handler)
 *   .listen(2319, () => console.log("Server started on http://localhost:2319"))
 * ```
 */
export const parse = (
  input: IncomingMessage | AsyncIterable<Uint8Array> | Iterable<Uint8Array>,
  options: ParseOptions = {}
) => new Promise<Body>((resolve, reject) => {
  let headers: IncomingHttpHeaders | undefined
  let readable: Readable

  if (!isPlainObject(options)) {
    throw new TypeError("Expected options argument to be an object.")
  }

  if (input instanceof IncomingMessage) {
    readable = input
    headers = options.headers ?? input.headers
  } else if (isAsyncIterable(input)) {
    console.log({input, options})
    readable = Readable.from(input)
    headers = options.headers
  } else {
    throw new TypeError(
      "Input must be IncomingMessage or "
        + "an object with callable @@asyncIterator property."
    )
  }

  const opts = merge({}, defaults, options, {headers})

  const parser = busboy(opts)
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

  readable.pipe(parser)
})
