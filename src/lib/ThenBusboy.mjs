import {IncomingMessage} from "http"
import {join} from "path"

import objectDeepFromEntries from "object-deep-from-entries"
import invariant from "@octetstream/invariant"
import Busboy from "busboy"
import merge from "lodash.merge"

import map from "./util/mapListeners"
import getType from "./util/getType"
import isPlainObject from "./util/isPlainObject"
import readListeners from "./util/readListeners"
import apply from "./util/selfInvokingClass"
import proxy from "./util/proxy"

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
 * @return {Promise<object>}
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
class ThenBusboy {
  constructor(request, options = {}) {
    this.__request = request
    this.__options = options
    this.__entries = []
    this.__onField = []
  }

  onField = fn => {
    this.__onField.push(fn)

    return this
  }

  exec = () => new Promise((resolve, reject) => {
    invariant(
      !(this.__request instanceof IncomingMessage), TypeError,

      "Request should be an instance of http.IncomingMessage. Received %s",
      getType(this.__request)
    )

    invariant(
      !isPlainObject(this.__options), TypeError,

      "Options should be an object. Received %s", getType(this.__options)
    )

    const options = merge(
      {}, defaults, this.__options, {headers: this.__request.headers}
    )

    const busboy = new Busboy(this.__request, options)

    const fulfill = (err, entry) => (
      err ? reject(err) : this.__entries.push(entry)
    )

    const listeners = map(initializers, fn => fn(options, fulfill))

    // Set listeners before starting
    map(listeners, (fn, name) => busboy.on(name, fn))

    const onError = error => {
      // Cleanup listeners before rejecting
      map(listeners, (fn, name) => busboy.removeListener(name, fn))

      reject(error)
    }

    const onFinish = () => {
      try {
        resolve(objectDeepFromEntries(this.__entries))
      } catch (err) {
        reject(err)
      } finally {
        // Cleanup listeners before resolving
        map(listeners, (fn, name) => busboy.removeListener(name, fn))
      }
    }

    busboy
      .once("error", onError)
      .once("finish", onFinish)

    this.__request.pipe(busboy)
  })

  then = (onFulfilled, onRejected) => this.exec().then(onFulfilled, onRejected)

  catch = onRejected => this.exec().catch(onRejected)
}

export default proxy({apply})(ThenBusboy)
