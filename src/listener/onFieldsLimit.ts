import {NoopInitializer} from "./Initializers.js"

import createError from "../util/requestEntityTooLarge.js"

const createOnFieldsLimit: NoopInitializer = ({limits}, entries) => () => {
  entries.emit(
    "error",

    createError(
      `Fields limit exceeded: Available up to ${limits!.fields} fields.`
    )
  )
}

export default createOnFieldsLimit
