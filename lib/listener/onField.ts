import {OnFieldInitializer} from "./Initializers"
import {BodyField} from "../BodyField"

import createError from "../util/requestEntityTooLarge"

import getFieldPath from "../util/getFieldPath"
import castType from "../util/castType"

const createOnField: OnFieldInitializer = ({castTypes, limits}, entries) => (
  name,
  value,
  fieldnameTruncated,
  valueTruncated,
  enc,
  type
): void => {
  if (valueTruncated) {
    return void entries.emit(
      "error",

      createError(
        `Field size limit exceeded: Available up to ${
          limits!.fieldSize
        } bytes per field.`
      )
    )
  }

  entries.enqueue()

  try {
    if (castTypes) {
      value = castType(String(value))
    }

    const path = getFieldPath(name)

    entries.pull([
      path,

      new BodyField(value, name, {
        fieldnameTruncated,
        valueTruncated,
        type,
        enc
      })
    ])
  } catch (error) {
    entries.emit("error", error)
  }
}

export default createOnField
