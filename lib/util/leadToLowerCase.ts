/**
 * @api private
 */
const toLowerCase = (string: string) => (
  String.prototype.toLowerCase.call(string)
)

/**
 * @api private
 */
const leadToLowerCase = (string: string) => (
  `${toLowerCase(string.charAt(0))}${string.slice(1)}`
)

export default leadToLowerCase
