import getFieldPath from "lib/util/getFieldPath"

const onField = (_, cb) => (fieldname, value) => {
  let path = null
  try {
    path = getFieldPath(fieldname)
  } catch (err) {
    return cb(err)
  }

  cb(null, [
    path, value
  ])
}

export default onField
