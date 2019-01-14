import PartsLimitError from "lib/error/PartsLimitError"

const onPartsLimit = ({limits}, cb) => () => (
  cb(
    new PartsLimitError(`Limit reached: Available up to ${limits.parts} parts.`)
  )
)

export default onPartsLimit
