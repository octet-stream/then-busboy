import {inspect} from "util"

export interface FieldOptions {
  fieldnameTruncated?: boolean
  valueTruncated?: boolean
  enc?: string
  type?: string
}

/**
 * @api private
 */
export class Field {
  name: string

  #value: unknown

  fieldnameTruncated?: boolean

  valueTruncated?: boolean

  enc?: string

  type?: string

  constructor(value: unknown, name: string, options: FieldOptions = {}) {
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
    return "Field"
  }

  [inspect.custom]() {
    return this[Symbol.toStringTag]
  }
}
