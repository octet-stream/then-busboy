import {Readable} from "stream"

import File from "lib/File"
import getFieldPath from "lib/util/getFieldPath"

const onFile = (options, cb) => (fieldname, stream, filename, enc, mime) => {
  try {
    const path = getFieldPath(fieldname)

    const contents = new Readable({
      read() { /* noop */ }
    })

    const onData = ch => void contents.push(ch)

    const onEnd = () => {
      contents.push(null)

      const file = new File({filename, contents, enc, mime})

      cb(null, [
        path, file
      ])
    }

    stream
      .on("error", cb)
      .on("data", onData)
      .on("end", onEnd)
  } catch (err) {
    return cb(err)
  }
}

export default onFile
