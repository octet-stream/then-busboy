import PartsLimitError from "../error/PartsLimitError"

const onPartsLimit = (_, cb) => () => (
  cb(new PartsLimitError("Parts limit reached"))
)

export default onPartsLimit
