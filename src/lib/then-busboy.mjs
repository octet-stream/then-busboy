import {IncomingMessage} from "http"

import merge from "lodash.merge"
import invariant from "@octetstream/invariant"

import waterfall from "./util/arrayRunWaterfall"
import isPlainObject from "./util/isPlainObject"
import getType from "./util/getType"
import exec from "./execBusboy"
import Body from "./Body"

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
async function thenBusboy(request, options = {}) {
  invariant(
    !(request instanceof IncomingMessage), TypeError,

    "Request must be an instance of http.IncomingMessage. Received %s",
    getType(request)
  )

  invariant(
    !isPlainObject(options), TypeError,

    "Options must be an object. Received %s", getType(options)
  )

  options = merge({}, defaults, options, {headers: request.headers})

  const params = {request, options}

  return waterfall([exec, Body.from], params)
}

export default thenBusboy
