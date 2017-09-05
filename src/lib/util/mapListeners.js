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
function mapListeners(listeners, callee) {
  const res = {}

  for (const [key, fn] of entries(listeners)) {
    const name = key.startsWith("on") ? leadToLowerCase(key.slice(2)) : key

    if (!(["error", "end"].includes(name))) {
      res[name] = callee(fn, name)
    }
  }

  return res
}

export default mapListeners
