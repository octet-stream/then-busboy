import FilesLimitError from "../error/FilesLimitError"

const onFilesLimit = ({limits}, cb) => () => (
  cb(
    new FilesLimitError(
      `Limit reached: Available up to ${limits.files} files.`
    )
  )
)

export default onFilesLimit
