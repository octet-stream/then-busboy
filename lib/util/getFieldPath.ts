import FieldPath from "./FieldPath"
import isNaN from "./isNaN"

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
 * @param key
 */
const castNumKey = (key: string): string | number => (
  isNaN(key) ? key : Number(key)
)

/**
 * @param {string} string
 */
const fromDotNotation = (string: string): FieldPath => (
  string.split(".").map(castNumKey)
)

/**
 * @param string
 */
const fromSquareBracesNotation = (string: string): FieldPath => (
  string.split(/[[\]]/).filter(Boolean).map(castNumKey)
)

/**
 * Returns fields path as array
 *
 * @param fieldname
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
function getFieldPath(fieldname: string): FieldPath {
  if (!fieldname) {
    throw new Error("Field name cannot be empty.")
  }

  if (DOT_EXPR.test(fieldname)) {
    return fromDotNotation(fieldname)
  }

  if (BRACKET_EXPR.test(fieldname)) {
    return fromSquareBracesNotation(fieldname)
  }

  throw new Error(`Unexpected field name format: ${fieldname}`)
}

export default getFieldPath
