import {NoopInitializer} from "./Initializers"
import {FieldsLimitError} from "../error"

const createOnFieldsLimit: NoopInitializer = ({limits}, cb) => () => {
  cb(
    new FieldsLimitError(
      `Limit reached: Available up to ${limits!.fields} fields.`
    )
  )
}

export default createOnFieldsLimit
