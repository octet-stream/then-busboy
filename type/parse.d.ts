import {IncomingMessage} from "http"

import Body from "./Body"

export interface Options extends busboy.Options {
  castTypes?: boolean

  /**
   * @deprecated Use castTypes option instead
   */
  restoreTypes?: boolean
}

/**
 * Promise-based wrapper around Busboy. Inspired by async-busboy.
 * You'll get exactly what you've sent from your client app.
 * All files and other fields in a single object.
 *
 * @param request HTTP request object
 * @param options then-busboy options
 *
 * @return
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
export function parse<T extends Record<string, any> = Record<string, any>>(request: IncomingMessage, options?: Options): Promise<Body<T>>

export default parse
