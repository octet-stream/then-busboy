import {readdirSync} from "fs"
import {basename, extname, join} from "path"

/**
 * @api private
 */
function readListeners(path) {
  const res = {}

  const dir = readdirSync(path)

  for (const filename of dir) {
    const ext = extname(filename)
    if (ext === ".js") {
      const base = basename(filename, ext)

      res[base] = require(join(path, base)).default
    }
  }

  return res
}

export default readListeners
