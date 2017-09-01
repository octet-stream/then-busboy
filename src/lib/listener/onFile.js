import clone from "cloneable-readable"

import File from "lib/File"
import getFieldPath from "lib/util/getFieldPath"

const onFile = (options, cb) => (fieldname, stream, filename, enc, mime) => {
  let path = null
  try {
    path = getFieldPath(fieldname)
  } catch (err) {
    return cb(err)
  }

  const contents = clone(stream)

  const file = new File({filename, contents, enc, mime})

  // Busboy will not fire "finish" event if I don't call this one.
  stream.emit("end")

  cb(null, [
    path, file
  ])
}

export default onFile
