const toLowerCase = str => String.prototype.toLowerCase.call(str)

/**
 * @api private
 */
const leadToLowerCase = str => `${toLowerCase(str.charAt(0))}${str.slice(1)}`

export default leadToLowerCase
