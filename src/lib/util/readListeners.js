import {readdirSync} from "fs"
import {basename, extname, join} from "path"

/**
 * @api private
 */
function readListeners(path) {
  const res = {}

  const dir = readdirSync(path)

  for (const filename of dir) {
    const base = basename(filename, extname(filename))

    res[base] = require(join(path, base))
  }

  return res
}

export default readListeners
