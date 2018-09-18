import getFieldPath from "../util/getFieldPath"
import convert from "../util/restoreType"

/**
 * @api private
 */
const onField = ({restoreTypes}, cb) => (
  (fieldname, value, fieldnameTruncated, valueTruncated, enc, mime) => {
    try {
      const path = getFieldPath(fieldname)

      cb(null, [path, restoreTypes ? convert(value) : value])
    } catch (err) {
      cb(err)
    }
  }
)

export default onField
