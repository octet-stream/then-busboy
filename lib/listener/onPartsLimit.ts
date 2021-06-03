import {NoopInitializer} from "./Initializers"

import createError from "../util/requestEntityTooLarge"

const createOnPartsLimit: NoopInitializer = ({limits}, cb) => () => {
  cb(
    createError(
      `Limit reached: Available up to ${limits!.parts} parts.`
    )
  )
}

export default createOnPartsLimit
