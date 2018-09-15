/**
 * Turn an ES6 class to self-invoking one!
 *
 * @param {Function} Target
 * @param {any} ctx
 * @param {any[]} args
 *
 * @return object – an instance of Target class
 *
 * @api private
 */
const selfInvokingClass = (Target, ctx, args) => new Target(...args)

export default selfInvokingClass
