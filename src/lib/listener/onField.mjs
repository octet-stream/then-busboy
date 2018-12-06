import getFieldPath from "../util/getFieldPath"
import cast from "../util/restoreType"

/**
 * @api private
 */
const onField = ({restoreTypes}, cb) => (
  (fieldname, value, fieldnameTruncated, valueTruncated, enc, mime) => {
    try {
      const path = getFieldPath(fieldname)

      value = restoreTypes ? cast(value) : value

      cb(null, [path, {
        fieldname,
        value,
        fieldnameTruncated,
        valueTruncated,
        enc,
        mime
      }])
    } catch (err) {
      cb(err)
    }
  }
)

export default onField
