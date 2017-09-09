import File from "lib/File"

/**
 * Check if given values is a File
 *
 * @param {any} val
 *
 * @return {boolean}
 *
 * @api public
 */
const isFile = val => val instanceof File

export default isFile
