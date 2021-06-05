import {NoopInitializer} from "./Initializers"

import createError from "../util/requestEntityTooLarge"

const createOnFilesLimit: NoopInitializer = ({limits}, ee) => () => {
  ee.emit(
    "error",

    createError(
      `Files limit exceeded: Available up to ${limits!.files} files.`
    )
  )
}

export default createOnFilesLimit
