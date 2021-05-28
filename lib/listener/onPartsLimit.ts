import {NoopInitializer} from "./Initializers"
import {PartsLimitError} from "../error"

const createOnPartsLimit: NoopInitializer = ({limits}, cb) => () => {
  cb(
    new PartsLimitError(
      `Limit reached: Available up to ${limits!.parts} parts.`
    )
  )
}

export default createOnPartsLimit
