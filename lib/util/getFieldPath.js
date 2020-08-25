const isNaN = require("./isNaN")

// Matched square braces notation paths
const BRACKET_EXPR = /^([^0-9[\]\n\r\t]+|\[[0-9]+\])(\[[^[\]]+\])*$/

// Matches dot notation paths
const DOT_EXPR = /^([a-z0-9_$]*)(?:\.([a-z0-9_$]*))*?$/i

/**
 * @param {string} string
 *
 * @return {Array<string | number>}
 */
const fromDotNotation = string => (
  string.split(".").map(key => isNaN(key) ? key : Number(key))
)

/**
 * @param {string} string
 *
 * @return {Array<string | number>}
 */
function fromSquareBracesNotation(string) {
  const res = []

  for (const element of string.split("[")) {
    if (element) {
      const key = element.endsWith("]") ? element.slice(0, -1) : element

      res.push(isNaN(key) ? key : Number(key))
    }
  }

  return res
}

/**
 * Get a fild path
 *
 * @param {string} fieldname
 *
 * @return {Array<string|number>}
 *
 * @throws {TypeError} when given fieldname is not a string
 * @throws {Error} on unexpected fieldname format
 *
 * @example
 *
 * getFieldPath("foo[bar][baz]") // -> ["foo", "bar", "baz"]
 *
 * getFieldPath("foo") // -> ["foo"]
 *
 * getFieldPath("[42]") // -> [42]
 *
 * getFieldPath("root.nested") // -> ["root", "nested"]
 *
 * getFieldPath("someCollection.0.name") // -> ["someCollection", 0, "name"]
 */
function getFieldPath(fieldname) {
  if (DOT_EXPR.test(fieldname)) {
    return fromDotNotation(fieldname)
  }

  if (BRACKET_EXPR.test(fieldname)) {
    return fromSquareBracesNotation(fieldname)
  }

  throw new Error("Unexpected field name format: %s")
}

module.exports = getFieldPath
