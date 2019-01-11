import FieldsLimitError from "../error/FieldsLimitError"

const onFieldsLimit = (_, cb) => () => (
  cb(new FieldsLimitError("Fields limit reached"))
)

export default onFieldsLimit
