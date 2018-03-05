
import invariant from "@octetstream/invariant"

import isString from "./isString"
import getType from "./getType"
import isNaN from "./isNaN"

const format = /^([^[\]\n]+)(\[[^[\]]+\])*$/

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
  const res = []

  invariant(
    !isString(fieldname), TypeError,
    "Field name should be a string. Received %s", getType(fieldname)
  )

  invariant(!fieldname, "Field name cannot be empty.")

  invariant(
    !format.test(fieldname),
    "Unexpected name format of the field: %s", fieldname
  )

  for (const element of fieldname.split("[")) {
    const key = element.endsWith("]") ? element.slice(0, -1) : element

    res.push(isNaN(key) ? key : Number(key))
  }

  return res
}

export default getFieldPath
