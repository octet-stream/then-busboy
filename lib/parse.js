const {IncomingMessage} = require("http")

const Busboy = require("busboy")
const merge = require("lodash.merge")

const isPlainObject = require("./util/isPlainObject")
const map = require("./util/mapListeners")
const Body = require("./Body")

const onFile = require("./listener/onFile")
const onField = require("./listener/onField")
const onFilesLimit = require("./listener/onFilesLimit")
const onPartsLimit = require("./listener/onPartsLimit")
const onFieldsLimit = require("./listener/onFieldsLimit")

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
 * @typedef {busboy.BusboyConfig & {restoreTypes: boolean}} ThenBusboyOptions
 */

/**
 * Promise-based wrapper around Busboy. Inspired by async-busboy.
 * You'll get exactly what you've sent from your client app.
 * All files and other fields in a single object.
 *
 * @param {IncomingMessage} request HTTP request object
 * @param {ThenBusboyOptions} [options = {}] then-busboy options
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
const parse = (request, options = {}) => new Promise((resolve, reject) => {
  if (!(request instanceof IncomingMessage)) {
    throw new TypeError(
      "Request must be an instance of http.IncomingMessage."
    )
  }

  if (!isPlainObject(options)) {
    throw new TypeError("Options must be an object.")
  }

  options = merge({}, defaults, options, {headers: request.headers})

  /**
   * @type {Array<[Array<string | number>, any]>}
   */
  const entries = []
  const busboy = new Busboy(options)

  /**
   * @param {Error} err
   * @param {[Array<string | number>, any]} entry
   *
   * @return {void}
   *
   * @api private
   */
  const fulfill = (err, entry) => err ? reject(err) : entries.push(entry)

  const listeners = map(initializers, fn => fn(options, fulfill))

  const unsubscribe = () => (
    map(listeners, (fn, name) => busboy.removeListener(name, fn))
  )

  function onFinish() {
    unsubscribe()
    resolve(Body.from(entries))
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

module.exports = parse
module.exports.default = parse
module.exports.parse = parse
