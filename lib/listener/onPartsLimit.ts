import {NoopInitializer} from "./Initializers"

import createError from "../util/requestEntityTooLarge"

const createOnPartsLimit: NoopInitializer = ({limits}, ee) => () => {
  ee.emit(
    "error",

    createError(
      `Limit reached: Available up to ${limits!.parts} parts.`
    )
  )
}

export default createOnPartsLimit
