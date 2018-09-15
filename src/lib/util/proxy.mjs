/**
 * @api private
 */
const proxy = handlers => Target => new Proxy(Target, handlers)

export default proxy
