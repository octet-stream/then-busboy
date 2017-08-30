// import invariant from "@octetstream/invariant"

/**
 * Create an object from given entries
 *
 * @param {array} entries
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
