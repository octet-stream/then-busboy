import {NoopInitializer} from "./Initializers"

import createError from "../util/requestEntityTooLarge"

const createOnFieldsLimit: NoopInitializer = ({limits}, entries) => () => {
  entries.emit(
    "error",

    createError(
      `Fields limit exceeded: Available up to ${limits!.fields} fields.`
    )
  )
}

export default createOnFieldsLimit
