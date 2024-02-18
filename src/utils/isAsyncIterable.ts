import {isFunction} from "./isFunction.js"

/**
 * Checks if given value is of type `AsyncIterable<T>`
 *
 * @param value - A value to test
 *
 * @internal
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
