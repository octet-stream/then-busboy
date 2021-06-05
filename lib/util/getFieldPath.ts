import createError from "http-errors"

import type {BodyEntryPath} from "../Body"

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
const fromDotNotation = (string: string): BodyEntryPath => (
  string.split(".").map(castNumKey)
)

/**
 * @param string
 */
const fromSquareBracesNotation = (string: string): BodyEntryPath => (
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
function getFieldPath(fieldname: string): BodyEntryPath {
  if (!fieldname) {
    throw createError(400, "Field name cannot be empty.")
  }

  if (DOT_EXPR.test(fieldname)) {
    return fromDotNotation(fieldname)
  }

  if (BRACKET_EXPR.test(fieldname)) {
    return fromSquareBracesNotation(fieldname)
  }

  throw createError(400, `Incorrect field name format at: ${fieldname}`)
}

export default getFieldPath
