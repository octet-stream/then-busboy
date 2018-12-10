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

  json() {
    return fromEntries(normalize(this.entries))
  }

  formData() {
    const fd = new FormData()

    for (const [path, field] of normalize(this.entries)) {
      fd.append(toFieldname(path), isFile(field) ? field.stream : field)
    }

    return fd
  }
}

export default Body
