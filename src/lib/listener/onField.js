import getFieldPath from "lib/util/getFieldPath"
import restoreType from "lib/util/restoreType"

const onField = (options, cb) => (fieldname, value) => {
  let path = null
  try {
    path = getFieldPath(fieldname)
  } catch (err) {
    return cb(err)
  }

  cb(null, [
    path, options.restoreTypes ? restoreType(value) : value
  ])
}

export default onField
