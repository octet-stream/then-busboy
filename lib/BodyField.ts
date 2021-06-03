import {inspect} from "util"

export interface BodyFieldOptions {
  fieldnameTruncated?: boolean
  valueTruncated?: boolean
  enc?: string
  type?: string
}

/**
 * @api private
 */
export class BodyField {
  name: string

  #value: unknown

  fieldnameTruncated?: boolean

  valueTruncated?: boolean

  enc?: string

  type?: string

  constructor(value: unknown, name: string, options: BodyFieldOptions = {}) {
    this.name = name
    this.#value = value

    this.fieldnameTruncated = options.fieldnameTruncated
    this.valueTruncated = options.valueTruncated
    this.enc = options.enc
    this.type = options.type
  }

  valueOf(): unknown {
    return this.#value
  }

  get [Symbol.toStringTag]() {
    return "BodyField"
  }

  [inspect.custom]() {
    return this[Symbol.toStringTag]
  }
}
