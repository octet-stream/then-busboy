// import invariant from "@octetstream/invariant"

/**
 * Create an object from given entries
 *
 * @param {array} entries
 *
 * @return {object}
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

  for (const [paths, value] of entries) {
    const root = paths.shift()

    if (paths.length < 1) {
      res[root] = value
    } else {
      // noop
    }
  }

  return res
}

export default objectFromEntries
