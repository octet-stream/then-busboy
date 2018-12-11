import {IncomingMessage} from "http"

import merge from "lodash.merge"

import Body from "./Body"
import exec from "./execBusboy"
import getType from "./util/getType"
import isPlainObject from "./util/isPlainObject"
import waterfall from "./util/arrayRunWaterfall"

const defaults = {
  restoreTypes: true
}

/**
 * Promise-based wrapper around Busboy. Inspired by async-busboy.
 * You'll get exactly what you've sent from your client app.
 * All files and other fields in a single object.
 *
 * @param {http.IncomingMessage} request – HTTP request object
 * @param {object} [options = {}] - then-busboy options
 *
 * @return {Promise<Body>}
 *
 * @api public
 *
 * @example
 *
 * // Simplest Koa.js middleware:
 * import busboy, {Body} from "then-busboy"
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
 */
function thenBusboy(request, options = {}) {
  if (!(request instanceof IncomingMessage)) {
    return Promise.reject(new TypeError(
      "Request must be an instance of http.IncomingMessage. " +
      `Received ${getType(request)}`
    ))
  }

  if (!isPlainObject(options)) {
    return Promise.reject(new TypeError(
      `Options must be an object. Received ${getType(options)}`
    ))
  }

  options = merge({}, defaults, options, {headers: request.headers})

  const params = {request, options}

  return waterfall([exec, Body.from], params)
}

export default thenBusboy
