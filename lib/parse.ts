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

type BusboyConfig = Omit<ConstructorParameters<typeof Busboy>[0], "headers">

export interface ParseOptions extends BusboyConfig {
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
