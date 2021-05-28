import {OnFieldInitializer} from "./Initializers"
import {FieldSizeLimitError} from "../error"
import {Field} from "../Field"

import getFieldPath from "util/getFieldPath"
import castType from "util/castType"

const createOnField: OnFieldInitializer = ({castTypes, limits}, cb) => (
  name,
  value,
  fieldnameTruncated,
  valueTruncated,
  enc,
  type
): void => {
  if (valueTruncated) {
    return cb(
      new FieldSizeLimitError(
        `Limit reached: Available up to ${limits!.fieldSize} bytes per field.`
      )
    )
  }

  try {
    if (castTypes) {
      value = castType(String(value))
    }

    const path = getFieldPath(name)

    cb(null, [
      path,

      new Field(value, name, {
        fieldnameTruncated,
        valueTruncated,
        type,
        enc
      })
    ])
  } catch (error) {
    cb(error)
  }
}

export default createOnField
