import Field from "../Field"
import cast from "../util/restoreType"
import getFieldPath from "../util/getFieldPath"

/**
 * @api private
 */
const onField = ({restoreTypes}, cb) => (
  (fieldname, value, fieldnameTruncated, valueTruncated, enc, mime) => {
    try {
      const path = getFieldPath(fieldname)

      value = restoreTypes ? cast(value) : value

      cb(null, [path, new Field({
        fieldname,
        value,
        fieldnameTruncated,
        valueTruncated,
        enc,
        mime
      })])
    } catch (err) {
      cb(err)
    }
  }
)

export default onField
