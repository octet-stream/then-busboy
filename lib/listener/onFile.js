const {createWriteStream} = require("fs")
const {join} = require("path")
const {tmpdir} = require("os")

const {nanoid} = require("nanoid")

const File = require("../File")
const getFieldPath = require("../util/getFieldPath")
const FileSizeLimitError = require("../error/FileSizeLimitError")

/**
 * Get a file from part and push it to entries array
 *
 * @api private
 */
const onFile = ({limits}, cb) => (fieldname, stream, filename, enc, mime) => {
  try {
    const fieldPath = getFieldPath(fieldname)

    const originalFilename = filename

    filename = join(tmpdir(), `${nanoid()}__${filename}`)

    function onEnd() {
      const file = new File({originalFilename, path: filename, mime, enc})

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

module.exports = onFile
