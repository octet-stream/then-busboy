import isNaN from "./isNaN"

/**
 * @param {array|object} target
 * @param {array} path
 * @param {any} value
 *
 * @return {array|object}
 *
 * @api private
 */
function restoreObjectStructure(target, path, value) {
  const currentPath = path.shift()
  const curr = isNaN(currentPath) ? {} : []

  if (!target) {
    if (path.length === 0) {
      curr[currentPath] = value

      return curr
    }

    curr[currentPath] = restoreObjectStructure(curr[currentPath], path, value)

    return curr
  }

  if (path.length === 0) {
    target[currentPath] = value

    return target
  }

  target[currentPath] = restoreObjectStructure(
    target[currentPath], path, value
  )

  return target
}

/**
 * Create an object from given entries
 *
 * @param {array} entries
 *
 * @return {object}
 *
 * @api private
 *
 * @example
 *
 * const entries = [
 *   [
 *     ["name"], "John Doe"
 *   ],
 *   [
 *     ["age"], 25
 *   ],
 *   [
 *     ["gender"], "Male"
 *   ]
 * ]
 *
 * objectFromEntries(entries) // -> {name: "John Doe", age: 25, gender: "Male"}
 */
function objectFromEntries(entries) {
  const res = {}

  for (const [path, value] of entries) {
    const root = path.shift()

    if (path.length < 1) {
      res[root] = value
    } else {
      res[root] = restoreObjectStructure(res[root], path, value)
    }
  }

  return res
}

export default objectFromEntries
