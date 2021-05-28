import {NoopInitializer} from "./Initializers"
import {FilesLimitError} from "../error"

const createOnFilesLimit: NoopInitializer = ({limits}, cb) => () => {
  cb(
    new FilesLimitError(
      `Limit reached: Available up to ${limits!.files} files.`
    )
  )
}

export default createOnFilesLimit
