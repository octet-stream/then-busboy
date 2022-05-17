import isFunction from "./isFunction.js"

function isIterable(value: unknown): value is AsyncIterable<Uint8Array> {
  if (!value || typeof value !== "object") {
    return false
  }

  if (isFunction((value as AsyncIterable<Uint8Array>)[Symbol.asyncIterator])) {
    return true
  }

  return false
}

export default isIterable
