import fs from "fs"
import p from "path"

/**
 * Read listeners from the disk
 *
 * @param {string} path – an absolute path to listeners directory.
 *
 * @api private
 */
function readListeners(path) {
  const res = {}

  const dir = fs.readdirSync(path)

  for (const filename of dir) {
    const ext = p.extname(filename)
    if (["js", "mjs"].includes(ext.slice(1))) {
      const base = p.basename(filename, ext)

      res[base] = require(p.join(path, base)).default
    }
  }

  return res
}

export default readListeners
