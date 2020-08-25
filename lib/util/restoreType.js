const isNaN = require("./isNaN")

/**
 * Try restore value type
 *
 * @param {any} value
 *
 * @return {any}
 *
 * @api private
 */
function restoreType(value) {
  if (value === "null") {
    return null
  }

  if (value === "undefined") {
    return undefined
  }

  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  if (!isNaN(value)) {
    return Number(value)
  }

  return value
}

module.exports = restoreType
