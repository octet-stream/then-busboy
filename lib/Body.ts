import fromEntries from "object-deep-from-entries"

import {FormData} from "formdata-node"

import {Field} from "./Field"
import {
  BusboyEntries,
  BusboyEntry,
  BusboyEntryPath,
  BusboyEntryValue
} from "./BusboyEntries"

import toFieldname from "./util/pathToFieldName"
import isFile from "./util/isFile"

export class Body {
  #entries: BusboyEntries

  static from(entries: BusboyEntries): Body {
    return new Body(entries)
  }

  static json(value: BusboyEntries | Body): object {
    if (value instanceof Body) {
      return value.json()
    }

    return new Body(value).json()
  }

  static formData(value: BusboyEntries | Body): FormData {
    if (value instanceof Body) {
      return value.formData()
    }

    return new Body(value).formData()
  }

  constructor(entries: BusboyEntries) {
    this.#entries = entries
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
      form.append(toFieldname(path), value)
    }

    return form
  }
}
