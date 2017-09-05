import clone from "cloneable-readable"

import File from "lib/File"
import getFieldPath from "lib/util/getFieldPath"

const onFile = (options, cb) => (fieldname, stream, filename, enc, mime) => {
  try {
    const path = getFieldPath(fieldname)

    // We need to clone file Readable stream before creating a File instance.
    const contents = clone(stream)

    const file = new File({filename, contents, enc, mime})

    // Busboy will not fire "finish" event because of we're don't read data from
    //   a file stream. So, here we just fire "end" manually to prevent
    //   an inifinite Promise pending.
    stream.emit("end")

    cb(null, [
      path, file
    ])
  } catch (err) {
    return cb(err)
  }
}

export default onFile
