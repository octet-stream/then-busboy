import {IncomingMessage} from "http"

import merge from "lodash.merge"

import getType from "./util/getType"
import isPlainObject from "./util/isPlainObject"
import partial from "./util/partial"
import waterfall from "./util/arrayRunWaterfall"

import runBusboy from "./flow/runBusboy"
import createBody from "./flow/createBody"

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

    /**
     * @prop {Array<{kind: "any" | "field" | "file", fn: Function<Promise>}>}
     */
    this.__tasks = []
  }

  map = (fn, ctx = null) => {
    this.__tasks.push({kind: "any", fn, ctx})

    return this
  }

  mapFields = (fn, ctx) => {
    this.__tasks.push({kind: "fields", fn, ctx})

    return this
  }

  mapFiles = (fn, ctx) => {
    this.__tasks.push({kind: "files", fn, ctx})

    return this
  }

  __run = () => new Promise((resolve, reject) => {
    const options = merge({}, defaults, this.__options, {
      headers: this.__request.headers
    })

    waterfall([
      partial(runBusboy, [this.__request, options]), createBody, resolve
    ]).catch(reject)
  })

  then = (onFulfilled, onRejected) => this.__run().then(onFulfilled, onRejected)

  catch = onRejected => this.__run().catch(onRejected)
}

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

  return new ThenBusboy(request, options)
}

export default thenBusboy
