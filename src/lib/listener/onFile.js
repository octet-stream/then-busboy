import File from "lib/File"
import getFieldPath from "lib/util/getFieldPath"

const onFile = (options, cb) => (fieldname, contents, filename, enc, mime) => {
  let path = null
  try {
    path = getFieldPath(fieldname)
  } catch (err) {
    return cb(err)
  }

  const file = new File({filename, contents, enc, mime})

  cb(null, [
    path, file
  ])
}

export default onFile
