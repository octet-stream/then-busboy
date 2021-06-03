import {NoopInitializer} from "./Initializers"

import createError from "../util/requestEntityTooLarge"

const createOnFilesLimit: NoopInitializer = ({limits}, cb) => () => {
  cb(
    createError(
      `Limit reached: Available up to ${limits!.files} files.`
    )
  )
}

export default createOnFilesLimit
