const FieldSizeLimitError = require("../error/FieldSizeLimitError")
const getFieldPath = require("../util/getFieldPath")
const cast = require("../util/restoreType")
const Field = require("../Field")

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
      value = restoreTypes ? cast(value) : value

      const path = getFieldPath(fieldname)
      const field = new Field({
        fieldname,
        value,
        fieldnameTruncated,
        valueTruncated,
        enc,
        mime
      })

      cb(null, [path, field])
    } catch (err) {
      cb(err)
    }
  }
)

module.exports = onField
