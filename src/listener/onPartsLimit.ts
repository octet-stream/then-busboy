import {NoopInitializer} from "./Initializers.js"

import createError from "../util/requestEntityTooLarge.js"

const createOnPartsLimit: NoopInitializer = ({limits}, entries) => () => {
  entries.emit(
    "error",

    createError(
      `Parts limit exceeded: Available up to ${limits!.parts} parts.`
    )
  )
}

export default createOnPartsLimit
