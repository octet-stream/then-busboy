/**
 * @api private
 */
const getType = val => (
  Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
)

/**
 * @api private
 */
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

module.exports = isPlainObject
