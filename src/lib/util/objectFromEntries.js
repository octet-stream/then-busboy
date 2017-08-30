// import {isString} from "util"

/**
 * Create an object from given entries
 *
 * @param {array} entries
 */
function objectFromEntries(entries) {
  const res = {}

  for (const [paths, value] of entries) {
    if (paths.length === 1) {
      res[paths.pop()] = value
    } else {
      const root = paths.pop()
    }
  }

  return res
}

export default objectFromEntries
