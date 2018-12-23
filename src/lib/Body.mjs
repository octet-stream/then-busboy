import fromEntries from "object-deep-from-entries"
import FormData from "formdata-node"

import Field from "./Field"
import isFile from "./isFile"
import normalize from "./util/normalizeFields"
import toFieldname from "./util/pathToFieldname"

/**
 * @api public
 */
class Body {
  static isBody(value) {
    return value instanceof Body
  }

  static from(value) {
    return new Body(Body.isBody(value) ? value.entries() : value)
  }

  static json(value) {
    return Body.isBody(value) ? value.json() : Body.from(value).json()
  }

  static formData(value) {
    return Body.isBody(value) ? value.formData() : Body.from(value).formData()
  }

  constructor(entries) {
    this.__entries = entries.slice()
  }

  get length() {
    return this.__entries.length
  }

  get fields() {
    return this.filter(field => isFile(field) === false)
  }

  get files() {
    return this.filter(field => isFile(field))
  }

  [Symbol.iterator]() {
    return this.values()
  }

  * paths() {
    for (const [path] of this.entries()) {
      yield path
    }
  }

  * names() {
    for (const [path] of this.entries()) {
      yield toFieldname(path)
    }
  }

  * values() {
    for (const [, value] of this.entries()) {
      yield value
    }
  }

  entries = () => this.__entries

  map = (fn, ctx = null) => {
    const entries = []

    for (const [path, field] of this.entries()) {
      const name = toFieldname(path)

      let newField = fn.call(ctx, field, name, path, this.entries())
      if (!(newField instanceof Field) && !isFile(field)) {
        newField = new Field({...field, value: newField})
      }

      entries.push([path, newField])
    }

    return Body.from(entries)
  }

  forEach = (fn, ctx = null) => void this.map(fn, ctx)

  filter = (fn, ctx = null) => {
    const entries = []

    for (const [path, field] of this.entries()) {
      const name = toFieldname(path)

      if (fn.call(ctx, field, name, path, this.entries())) {
        entries.push([path, field])
      }
    }

    return Body.from(entries)
  }

  json = () => fromEntries(normalize(this.entries()))

  formData = () => {
    const fd = new FormData()

    for (const [path, field] of this.entries()) {
      const name = toFieldname(path)

      if (isFile(field)) {
        fd.set(name, field.stream, field.filename)
      } else {
        fd.set(name, field.value)
      }
    }

    return fd
  }
}

export default Body
