import http from "http"

import Busboy from "busboy"
import merge from "lodash.merge"
import invariant from "@octetstream/invariant"

import isPlainObject from "lib/util/isPlainObject"
import map from "lib/util/mapListeners"
import getType from "lib/util/getType"
import Body from "lib/Body"

import onFile from "lib/listener/onFile"
import onField from "lib/listener/onField"
import onFilesLimit from "lib/listener/onFilesLimit"
import onPartsLimit from "lib/listener/onPartsLimit"
import onFieldsLimit from "lib/listener/onFieldsLimit"

const initializers = {
  onFile,
  onField,
  onFilesLimit,
  onPartsLimit,
  onFieldsLimit
}

const defaults = {
  restoreTypes: true
}

/**
 * @param {http.IncomingMessage} request
 * @param {Object.<string, any>} [options = {}]
 *
 * @return {Promise<Object.<string, any>>}
 *
 * @api private
 */
const exec = (request, options) => new Promise((resolve, reject) => {
  const entries = []
  const busboy = new Busboy(options)

  const fulfill = (err, entry) => err ? reject(err) : entries.push(entry)

  const listeners = map(initializers, fn => fn(options, fulfill))

  const unsubscribe = () => (
    map(listeners, (fn, name) => busboy.removeListener(name, fn))
  )

  function onFinish() {
    unsubscribe()
    resolve(entries)
  }

  function onError(err) {
    unsubscribe()
    reject(err)
  }

  map(listeners, (fn, name) => busboy.on(name, fn))

  busboy
    .once("error", onError)
    .once("finish", onFinish)

  request.pipe(busboy)
})

/**
 * Promise-based wrapper around Busboy. Inspired by async-busboy.
 * You'll get exactly what you've sent from your client app.
 * All files and other fields in a single object.
 *
 * @param {http.IncomingMessage} request – HTTP request object
 * @param {Object.<string, any>} [options = {}] - then-busboy options
 *
 * @return {Promise<Body>}
 *
 * @api public
 *
 * @example
 *
 * ```js
 * // Simplest Koa.js middleware:
 * import {parse, Body} from "then-busboy"
 *
 * const toLowerCase = string => String.prototype.toLowerCase.call(string)
 *
 * const multipart = () => async (ctx, next) => {
 *   if (["post", "put"].includes(toLowerCase(ctx.method)) === false) {
 *     return next()
 *   }
 *
 *   if (ctx.is("multipart/form-data") === false) {
 *     return next()
 *   }
 *
 *   ctx.request.body = await busboy(ctx.req).then(Body.json)
 *
 *   await next()
 * }
 *
 * export default multipart
 * ```
 */
async function parse(request, options = {}) {
  invariant(
    !(request instanceof http.IncomingMessage), TypeError,

    "Request must be an instance of http.IncomingMessage. Received %s",
    getType(request)
  )

  invariant(
    !isPlainObject(options), TypeError,

    "Options must be an object. Received %s", getType(options)
  )

  options = merge({}, defaults, options, {headers: request.headers})

  return exec(request, options).then(Body.from)
}

export default parse
