import {readdirSync} from "fs"
import {basename, extname, join} from "path"

/**
 * Read listeners from the disk
 *
 * @param {string} path – an absolute path to listeners directory.
 *
 * @api private
 */
function readListeners(path) {
  const res = {}

  const dir = readdirSync(path)

  for (const filename of dir) {
    const ext = extname(filename)
    if (["js", "mjs"].includes(ext.slice(1))) {
      const base = basename(filename, ext)

      res[base] = require(join(path, base)).default
    }
  }

  return res
}

export default readListeners
