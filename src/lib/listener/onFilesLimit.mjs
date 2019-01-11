import FilesLimitError from "../error/FilesLimitError"

const onFilesLimit = (_, cb) => () => (
  cb(new FilesLimitError("Fields limit reached"))
)

export default onFilesLimit
