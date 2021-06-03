import fromEntries from "object-deep-from-entries"

import {FormData} from "formdata-node"

import {Field} from "./Field"
import {
  BusboyEntries,
  BusboyEntry,
  BusboyEntryPath,
  BusboyEntryValue
} from "./BusboyEntries"

import toFieldname from "./util/pathToFieldname"
import isField from "./util/isField"
import isFile from "./util/isFile"

/**
 * Body instaniation entries
 */
type BodyEntries = Array<[BusboyEntryPath, BusboyEntryValue | string]>

export class Body {
  #entries: BusboyEntries

  static from(entries: BodyEntries): Body {
    return new Body(entries)
  }

  static json(value: BodyEntries | Body): object {
    if (value instanceof Body) {
      return value.json()
    }

    return new Body(value).json()
  }

  static formData(value: BodyEntries | Body): FormData {
    if (value instanceof Body) {
      return value.formData()
    }

    return new Body(value).formData()
  }

  constructor(entries: BodyEntries) {
    this.#entries = entries.map(([path, value]) => [
      path,

      isFile(value) || isField(value)
        ? value
        : new Field(value, toFieldname(path))
    ])
  }

  get [Symbol.toStringTag](): string {
    return "Body"
  }

  get length(): number {
    return this.#entries.length
  }

  * entries(): Generator<BusboyEntry, void, undefined> {
    yield* this.#entries.values()
  }

  * keys(): Generator<BusboyEntryPath, void, undefined> {
    for (const [key] of this) {
      yield key
    }
  }

  * values(): Generator<BusboyEntryValue, void, undefined> {
    for (const [, value] of this) {
      yield value
    }
  }

  [Symbol.iterator]() {
    return this.entries()
  }

  files(): Body {
    const entries: BusboyEntries = []

    for (const [path, value] of this) {
      if (isFile(value)) {
        entries.push([path, value])
      }
    }

    return new Body(entries)
  }

  fields(): Body {
    const entries: BusboyEntries = []

    for (const [path, value] of this) {
      if (!isFile(value)) {
        entries.push([path, value])
      }
    }

    return new Body(entries)
  }

  json(): object {
    const entries: Array<[BusboyEntryPath, unknown]> = []

    for (const [path, value] of this) {
      entries.push([path, isFile(value) ? value : value.valueOf()])
    }

    return fromEntries(entries)
  }

  formData(): FormData {
    const form = new FormData()

    for (const [path, value] of this) {
      form.append(toFieldname(path), isFile(value) ? value : value.valueOf())
    }

    return form
  }
}
