import {createWriteStream} from "fs"
import {join, basename} from "path"
import {tmpdir} from "os"

import {nanoid} from "nanoid"

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

    const originalFilename = basename(filename)

    filename = join(tmpdir(), `${nanoid()}__${filename}`)

    function onEnd() {
      const file = new File({originalFilename, filename, mime, enc})

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
      .pipe(createWriteStream(filename))
  } catch (err) {
    return cb(err)
  }
}

export default onFile
