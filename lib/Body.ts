import fromEntries from "object-deep-from-entries"

import {FormData, File, FileLike} from "formdata-node"

import {Field} from "./Field"

import toFieldname from "./util/pathToFieldname"
import isField from "./util/isField"
import isFile from "./util/isFile"

export type BodyEntryPath = Array<string | number>

export type BodyEntryValue = File | FileLike | Field

export type BodyEntryRawValue =
  | BodyEntryValue
  | string
  | number
  | boolean
  | null
  | undefined

export type BodyEntry = [BodyEntryPath, BodyEntryValue]

export type BodyEntries = Array<[BodyEntryPath, BodyEntryValue]>

export type BodyRawEntries = Array<[BodyEntryPath, BodyEntryRawValue]>

export class Body {
  #entries: BodyEntries

  /**
   * A shortcut for Body#json()
   */
  static json(value: BodyRawEntries | Body): object {
    if (value instanceof Body) {
      return value.json()
    }

    return new Body(value).json()
  }

  /**
   * A shortcut for Body#formData()
   */
  static formData(value: BodyRawEntries | Body): FormData {
    if (value instanceof Body) {
      return value.formData()
    }

    return new Body(value).formData()
  }

  constructor(entries: BodyRawEntries) {
    this.#entries = entries.map(([path, value]) => [
      path,

      // Convert raw entry scalar values to Field class
      isFile(value) || isField(value)
        ? value
        : new Field(value, toFieldname(path))
    ])
  }

  get [Symbol.toStringTag](): string {
    return "Body"
  }

  /**
   * Returns an amount of entries in Body
   */
  get length(): number {
    return this.#entries.length
  }

  * entries(): Generator<BodyEntry, void, undefined> {
    yield* this.#entries.values()
  }

  * keys(): Generator<BodyEntryPath, void, undefined> {
    for (const [key] of this) {
      yield key
    }
  }

  * values(): Generator<BodyEntryValue, void, undefined> {
    for (const [, value] of this) {
      yield value
    }
  }

  [Symbol.iterator]() {
    return this.entries()
  }

  /**
   * Returns a new Body subset with only files in it
   */
  files(): Body {
    const entries: BodyEntries = []

    for (const [path, value] of this) {
      if (isFile(value)) {
        entries.push([path, value])
      }
    }

    return new Body(entries)
  }

  /**
   * Returns a new Body subset with only fields in it
   */
  fields(): Body {
    const entries: BodyEntries = []

    for (const [path, value] of this) {
      if (!isFile(value)) {
        entries.push([path, value])
      }
    }

    return new Body(entries)
  }

  /**
   * Returns an object representing Body entries
   */
  json(): object {
    const entries: Array<[BodyEntryPath, unknown]> = []

    for (const [path, value] of this) {
      entries.push([path, isFile(value) ? value : value.valueOf()])
    }

    return fromEntries(entries)
  }

  /**
   * Returns FormData representation of Body entries
   */
  formData(): FormData {
    const form = new FormData()

    for (const [path, value] of this) {
      form.append(toFieldname(path), isFile(value) ? value : value.valueOf())
    }

    return form
  }
}
