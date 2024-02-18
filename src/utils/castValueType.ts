import {isNaN} from "./isNaN.js"

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
 * @internal
 */
export function castValueType(value: string): CastResult {
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
