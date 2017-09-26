import {IncomingMessage} from "http"
import {join} from "path"

import invariant from "@octetstream/invariant"
import Busboy from "busboy"
import merge from "lodash.merge"

import map from "lib/util/mapListeners"
import getType from "lib/util/getType"
import isPlainObject from "lib/util/isPlainObject"
import readListeners from "lib/util/readListeners"
import objectFromEntries from "lib/util/objectFromEntries"

const initializers = readListeners(join(__dirname, "listener"))

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
 * @return {Promise<Object>}
 *
 * @api public
 *
 * @example
 *
 * // Simplest Koa.js middleware:
 * import busboy from "then-busboy"
 *
 * const toLowerCase = string => String.prototype.toLowerCase.call(string)
 *
 * const multipart = () => async (ctx, next) => {
 *   if (["post", "put"].includes(toLowerCase(ctx.method)) === false) {
 *     return await next()
 *   }
 *
 *   if (ctx.is("multipart/form-data") === false) {
 *     return await next()
 *   }
 *
 *   ctx.request.body = await busboy(ctx.req)
 *
 *   await next()
 * }
 *
 * export default multipart
 */
const thenBusboy = (request, options = {}) => new Promise((resolve, reject) => {
  invariant(
    !(request instanceof IncomingMessage), TypeError,
    "Request should be an instanceof http.IncomingMessage. Received %s",
    getType(request)
  )

  invariant(
    !isPlainObject(options), TypeError,
    "Options should be an object. Received %s", getType(options)
  )

  options = merge({}, defaults, options)

  const headers = request.headers

  const busboy = new Busboy(request, {
    ...options, headers
  })

  const entries = []

  const fulfill = (err, entry) => void (err ? reject(err) : entries.push(entry))

  const listeners = map(initializers, fn => fn(options, fulfill))

  // Set listeners before starting
  void map(listeners, (fn, name) => busboy.on(name, fn))

  function onFinish() {
    // Cleanup listeners
    void map(listeners, (fn, name) => busboy.removeListener(name, fn))

    try {
      return resolve(objectFromEntries(entries))
    } catch (err) {
      return reject(err)
    }
  }

  busboy
    .on("error", reject)
    .on("finish", onFinish)

  request.pipe(busboy)
})

export default thenBusboy
