const PartsLimitError = require("../error/PartsLimitError")

const onPartsLimit = ({limits}, cb) => () => (
  cb(
    new PartsLimitError(`Limit reached: Available up to ${limits.parts} parts.`)
  )
)

module.exports = onPartsLimit
