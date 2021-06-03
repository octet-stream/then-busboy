import {OnFieldInitializer} from "./Initializers"
import {BodyField} from "../BodyField"

import createError from "../util/requestEntityTooLarge"

import getFieldPath from "../util/getFieldPath"
import castType from "../util/castType"

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
      createError(
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

      new BodyField(value, name, {
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
