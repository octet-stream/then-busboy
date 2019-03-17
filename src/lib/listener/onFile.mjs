import os from "os"
import fs from "fs"
import path from "path"

import nanoid from "nanoid"

import File from "lib/File"
import getFieldPath from "lib/util/getFieldPath"
import FileSizeLimitError from "lib/error/FileSizeLimitError"

/**
 * Get a file from part and push it to entries array
 *
 * @api private
 */
const onFile = ({limits}, cb) => (fieldname, stream, filename, enc, mime) => {
  try {
    const fieldPath = getFieldPath(fieldname)

    filename = path.join(os.tmpdir(), `${nanoid()}__${filename}`)

    function onEnd() {
      const contents = fs.createReadStream(filename)
      const file = new File({filename, contents, enc, mime})

      cb(null, [fieldPath, file])
    }

    const onLimit = () => (
      cb(
        new FileSizeLimitError(
          `Limit reached: Available up to ${limits.fileSize} bytes per file.`
        )
      )
    )

    stream
      .once("error", cb)
      .once("end", onEnd)
      .once("limit", onLimit)
      .pipe(fs.createWriteStream(filename))
  } catch (err) {
    return cb(err)
  }
}

export default onFile
