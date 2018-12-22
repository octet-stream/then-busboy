import fromEntries from "object-deep-from-entries"
import FormData from "formdata-node"

import toFieldname from "./util/pathToFieldname"
import normalize from "./util/normalizeFields"
import isFile from "./isFile"

/**
 * @api public
 */
class Body {
  static isBody(value) {
    return value instanceof Body
  }

  static from(entries) {
    return new Body(entries)
  }

  static json(value) {
    return Body.isBody(value) ? value.json() : Body.from(value).json()
  }

  static formData(value) {
    return Body.isBody(value) ? value.formData() : Body.from(value).formData()
  }

  constructor(entries) {
    this.__entries = entries
  }

  get entries() {
    return this.__entries
  }

  get fields() {
    return Body.from(this.entries.filter(([, entry]) => !isFile(entry)))
  }

  get files() {
    return Body.from(this.entries.filter(([, entry]) => isFile(entry)))
  }

  map(fn, ctx = null) {
    const entries = []

    for (const [path, value] of this.entries) {
      const name = toFieldname(path)

      entries.push([path, fn.call(ctx, value, name, path, this.entries)])
    }

    return Body.from(entries)
  }

  forEach = (fn, ctx = null) => void this.map(fn, ctx)

  filter(fn, ctx = null) {
    const entries = []

    for (const [path, value] of this.entries) {
      const name = toFieldname(path)

      if (fn.call(ctx, value, name, path, this.entries)) {
        entries.push([path, value])
      }
    }

    return Body.from(entries)
  }

  json = () => fromEntries(normalize(this.entries))

  // TODO: Add tests for this case.
  // Also, make sure is that any required argument have passed properly
  formData = () => {
    const fd = new FormData()

    for (const [path, field] of this.entries) {
      fd.set(toFieldname(path), isFile(field) ? field.stream : field.value)
    }

    return fd
  }
}

export default Body
