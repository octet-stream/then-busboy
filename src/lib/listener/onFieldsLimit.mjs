import FieldsLimitError from "../error/FieldsLimitError"

const onFieldsLimit = ({limits}, cb) => () => (
  cb(
    new FieldsLimitError(
      `Limit reached: Available up to ${limits.fields} fields.`
    )
  )
)


export default onFieldsLimit
