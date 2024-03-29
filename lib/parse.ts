import type {IncomingHttpHeaders} from "http"
import {IncomingMessage} from "http"
import {Readable} from "stream"

import busboy from "busboy"
import merge from "lodash.merge"

import onFile from "./listener/onFile"
import onField from "./listener/onField"
import onFilesLimit from "./listener/onFilesLimit"
import onFieldsLimit from "./listener/onFieldsLimit"
import onPartsLimit from "./listener/onPartsLimit"

import isPlainObject from "./util/isPlainObject"
import map from "./util/mapListeners"

import {isAsyncIterable} from "./util/isAsyncIterable"
import {BodyEntries} from "./BodyEntries"
import {Body} from "./Body"

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
 * @param source HTTP IncomingMessage object
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
  // TODO: I use AsyncIterable<Uint8Array | Buffer | string> as the source type for compatibility with NodeJS.ReadableStream.
  // TODO: It should be replaced with AsyncIterable<Uint8Array>, when it gets fixed.
  source: AsyncIterable<Uint8Array | Buffer | string>,
  options: ParseOptions = {}
) => new Promise<Body>((resolve, reject) => {
  let headers: IncomingHttpHeaders | undefined
  let readable: Readable

  if (!isPlainObject(options)) {
    throw new TypeError("Expected options argument to be an object.")
  }

  if (source instanceof IncomingMessage) {
    readable = source
    headers = source.headers
  } else if (isAsyncIterable(source)) {
    readable = Readable.from(source)
    headers = options.headers
  } else {
    throw new TypeError(
      "The source argument must be instance of IncomingMessage or "
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
    .once("close", onBodyRead)

  readable.pipe(parser)
})
