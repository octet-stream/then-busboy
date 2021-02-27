const FieldsLimitError = require("../error/FieldsLimitError")

const onFieldsLimit = ({limits}, cb) => () => (
  cb(
    new FieldsLimitError(
      `Limit reached: Available up to ${limits.fields} fields.`
    )
  )
)

module.exports = onFieldsLimit
