import Field from "lib/Field"
import cast from "lib/util/restoreType"
import getFieldPath from "lib/util/getFieldPath"
import FieldSizeLimitError from "lib/error/FieldSizeLimitError"

/**
 * @api private
 */
const onField = ({restoreTypes, limits}, cb) => (
  (fieldname, value, fieldnameTruncated, valueTruncated, enc, mime) => {
    if (valueTruncated) {
      return cb(
        new FieldSizeLimitError(
          `Limit reached: Available up to ${limits.fieldSize} bytes per field.`
        )
      )
    }

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
