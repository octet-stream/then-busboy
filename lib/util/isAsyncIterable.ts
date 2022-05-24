import {isFunction} from "./isFunction"

/**
 * Checks if given object is AsyncIterable
 */
export function isAsyncIterable(
  value: unknown
): value is AsyncIterable<Uint8Array> {
  if (!value || typeof value !== "object") {
    return false
  }

  if (isFunction((value as AsyncIterable<Uint8Array>)[Symbol.asyncIterator])) {
    return true
  }

  return false
}
