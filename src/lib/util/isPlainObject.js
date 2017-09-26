import getType from "lib/util/getType"

// Based ob lodash/isPlainObject
function isPlainObject(val) {
  if (getType(val) !== "object") {
    return false
  }

  const pp = Object.getPrototypeOf(val)

  if (pp === null || pp === void 0) {
    return true
  }

  const Ctor = pp.constructor && pp.constructor.toString()

  return Ctor === Object.toString()
}

export default isPlainObject
