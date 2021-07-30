import {inspect} from "util"

export interface BodyFieldOptions {
  fieldnameTruncated?: boolean
  valueTruncated?: boolean
  enc?: string
  type?: string
}

export class BodyField<T = unknown> {
  readonly #value: T

  /**
   * Returns the name of the field
   */
  readonly name: string

  /**
   * Indicates whether the fieldname was truncated
   */
  readonly fieldnameTruncated?: boolean

  /**
   * Indicates whether the value was truncated
   */
  readonly valueTruncated?: boolean

  /**
   * Returns Content-Transfer-Encoding value
   */
  readonly enc?: string

  /**
   * Returns a value from Content-Type header
   */
  readonly type?: string

  constructor(value: T, name: string, options: BodyFieldOptions = {}) {
    this.name = name
    this.#value = value

    this.fieldnameTruncated = options.fieldnameTruncated
    this.valueTruncated = options.valueTruncated
    this.enc = options.enc
    this.type = options.type
  }

  /**
   * Returns the value of the BodyField
   */
  valueOf(): T {
    return this.#value
  }

  /**
   * Returns string representation of the BodyField value
   */
  toString() {
    return String(this.valueOf())
  }

  [inspect.custom]() {
    return `[BodyField: ${this}]`
  }
}
