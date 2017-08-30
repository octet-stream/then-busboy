import leadToLowerCase from "lib/util/leadToLowerCase"

const entries = Object.entries

/**
 * Walk throght listeners object and execute given function on each of them.
 *
 * @param {object} listeners
 * @param {function} callee
 *
 * @api private
 */
function eachListener(listeners, callee) {
  for (const [key, fn] of entries(listeners)) {
    const name = key.startsWith("on") ? leadToLowerCase(key.slice(2)) : key

    if (!(["error", "end"].includes(name))) {
      callee(name, fn.default)
    }
  }
}

export default eachListener
