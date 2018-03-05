import {Readable} from "stream"

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

    const contents = new Readable({
      read() { /* noop */ }
    })

    const onData = ch => void contents.push(ch)

    function onEnd() {
      contents.push(null)

      const file = new File({filename, contents, enc, mime})

      cb(null, [
        path, file
      ])
    }

    // Busboy doesn't emit an "end" event while file stream have not been read.
    // So, we just read the stream and push it to the other [Readable] one. o_O
    stream
      .on("error", cb)
      .on("data", onData)
      .on("end", onEnd)
  } catch (err) {
    return cb(err)
  }
}

export default onFile
