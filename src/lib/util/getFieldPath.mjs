
import invariant from "@octetstream/invariant"

import isString from "./isString"
import getType from "./getType"
import isNaN from "./isNaN"

// Matched square braces notation paths
const BRACKET_EXPR = /^([^0-9[\]\n\r\t]+|\[[0-9]+\])(\[[^[\]]+\])*$/

// Matches dot notation paths
const DOT_EXPR = /^([^.[\] ]+)(?:\.([^.[\] ]+))*?$/

const fromDotNotation = string => string.split(".")

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
 * getFieldPath("42") // -> [42]
 */
function getFieldPath(fieldname) {
  invariant(
    !isString(fieldname), TypeError,
    "Field name should be a string. Received %s", getType(fieldname)
  )

  invariant(!fieldname, "Field name cannot be empty.")

  switch (true) {
    case BRACKET_EXPR.test(fieldname):
      return fromSquareBracesNotation(fieldname)
    case DOT_EXPR.test(fieldname):
      return fromDotNotation(fieldname)
    default:
      return invariant(
        true, "Unexpected name format of the field: %s", fieldname
      )
  }
}

export default getFieldPath
