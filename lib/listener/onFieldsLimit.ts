import {NoopInitializer} from "./Initializers"

import createError from "../util/requestEntityTooLarge"

const createOnFieldsLimit: NoopInitializer = ({limits}, ee) => () => {
  ee.emit(
    "error",

    createError(
      `Fields limit exceeded: Available up to ${limits!.fields} fields.`
    )
  )
}

export default createOnFieldsLimit
