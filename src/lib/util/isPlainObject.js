import getType from "./getType"

const getPrototype = Object.getPrototypeOf
const objectCtorString = Object.toString()

// Based ob lodash/isPlainObject
function isPlainObject(val) {
  if (getType(val) !== "object") {
    return false
  }

  const pp = getPrototype(val)

  if (pp === null || pp === void 0) {
    return true
  }

  const Ctor = pp.constructor && pp.constructor.toString()

  return Ctor === objectCtorString
}

export default isPlainObject
