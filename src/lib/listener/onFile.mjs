import {createReadStream, createWriteStream} from "fs"
import {join} from "path"
import {tmpdir} from "os"

import nanoid from "nanoid"

import File from "../File"
import getFieldPath from "../util/getFieldPath"

/**
 * Get a file from part and push it to entries array
 *
 * @api private
 */
const onFile = (options, cb) => (fieldname, stream, filename, enc, mime) => {
  try {
    const path = getFieldPath(fieldname)

    filename = join(tmpdir(), `${nanoid()}__${filename}`)

    function onEnd() {
      const contents = createReadStream(filename)

      const file = new File({filename, contents, enc, mime})

      cb(null, [path, file])
    }

    stream
      .on("end", onEnd)
      .pipe(createWriteStream(filename))
  } catch (err) {
    return cb(err)
  }
}

export default onFile
