/**
 * Check if given values is NaN
 *
 * @param {any} val
 *
 * @return {boolean}
 *
 * @api private
 */
const isNaN = val => Number.isNaN(Number(val))

module.exports = isNaN
