import isNaN from "./isNaN"

type CastResult =
  | string
  | number
  | boolean
  | null
  | undefined

/**
 * Try restore value type
 *
 * @param value
 *
 * @api private
 */
function castType(value: string): CastResult {
  if (value === "null") {
    return null
  }

  if (value === "undefined") {
    return undefined
  }

  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  if (!isNaN(value)) {
    return Number(value)
  }

  return value
}

export default castType
