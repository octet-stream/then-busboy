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
export class BodyField<T = unknown> {
  readonly name: string

  readonly #value: T

  readonly fieldnameTruncated?: boolean

  readonly valueTruncated?: boolean

  readonly enc?: string

  readonly type?: string

  constructor(value: T, name: string, options: BodyFieldOptions = {}) {
    this.name = name
    this.#value = value

    this.fieldnameTruncated = options.fieldnameTruncated
    this.valueTruncated = options.valueTruncated
    this.enc = options.enc
    this.type = options.type
  }

  valueOf(): T {
    return this.#value
  }

  toString() {
    return String(this.valueOf())
  }

  [inspect.custom]() {
    return `[BodyField: ${this}]`
  }
}
