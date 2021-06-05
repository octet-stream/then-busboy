import {NoopInitializer} from "./Initializers"

import createError from "../util/requestEntityTooLarge"

const createOnPartsLimit: NoopInitializer = ({limits}, ee) => () => {
  ee.emit(
    "error",

    createError(
      `Parts limit exceeded: Available up to ${limits!.parts} parts.`
    )
  )
}

export default createOnPartsLimit
