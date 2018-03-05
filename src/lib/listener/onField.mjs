import getFieldPath from "../util/getFieldPath"
import restoreType from "../util/restoreType"

/**
 * @api private
 */
const onField = (options, cb) => (fieldname, value) => {
  try {
    const path = getFieldPath(fieldname)

    cb(null, [
      path, options.restoreTypes ? restoreType(value) : value
    ])
  } catch (err) {
    return cb(err)
  }
}

export default onField
