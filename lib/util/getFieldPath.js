const isNaN = require("./isNaN")

/**
 * Matches square braces notation paths
 *
 * e. g. foo[bar][0][baz]
 */
const BRACKET_EXPR = /^([^0-9[\]\n\r\t]+|\[[0-9]+\])(\[[^[\]]+\])*$/

/**
 * Matches dot notation paths
 *
 * e. g. foo.bar.0.baz
 */
const DOT_EXPR = /^([a-z0-9_$]*)(?:\.([a-z0-9_$]*))*?$/i

/**
 * Casts numeric keys to a number type
 *
 * @api private
 *
 * @param {string} key
 *
 * @return {string | number}
 */
const castNumKey = key => isNaN(key) ? key : Number(key)

/**
 * @param {string} string
 *
 * @return {Array<string | number>}
 */
const fromDotNotation = string => string.split(".").map(castNumKey)

/**
 * @param {string} string
 *
 * @return {Array<string | number>}
 */
const fromSquareBracesNotation = string => (
  string.split(/[[\]]/).filter(Boolean).map(castNumKey)
)

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
 * @api private
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
