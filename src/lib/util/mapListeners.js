import leadToLowerCase from "./leadToLowerCase"

const entries = Object.entries

/**
 * Walk throght listeners object and execute given function on each of them.
 *
 * @param {object} listeners
 * @param {function} fn
 *
 * @api private
 */
function mapListeners(listeners, fn) {
  const res = {}

  for (const [key, value] of entries(listeners)) {
    const name = key.startsWith("on") ? leadToLowerCase(key.slice(2)) : key

    if (!(["error", "end"].includes(name))) {
      res[name] = fn(value, name)
    }
  }

  return res
}

export default mapListeners
