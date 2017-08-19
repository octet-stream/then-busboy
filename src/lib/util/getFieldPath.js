import {isString} from "util"

import invariant from "@octetstream/invariant"

import getType from "lib/util/getType"

const allowed = /^([^[]\n]+)(\[[^[]]+\])*$/

/**
 * Get a fild path
 *
 * @param {string} fieldname
 *
 * @return {array<string|number>}
 *
 * @throws {TypeError}
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

  invariant(
    !allowed.test(fieldname), TypeError,
    "Unexpected name format of the field: %s", fieldname
  )

  for (const element of fieldname.split("[")) {
    const key = element.endsWith("]") ? element.slice(-1) : element

    res.push(isNaN(key) ? key : Number(key))
  }

  return res
}

export default getFieldPath
