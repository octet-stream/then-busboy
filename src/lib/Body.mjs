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
  /**
   * Check if given value is Body instance
   *
   * @param {any} value
   *
   * @return {boolean}
   */
  static isBody(value) {
    return value instanceof Body
  }

  /**
   * Create a new Body from given entries.
   * An alias of `new Body(entries)`
   *
   * @param {Array<[string[], any]>}
   *
   * @return {Body}
   */
  static from(entries) {
    return new Body(entries)
  }

  /**
   * Return an object with data taken from given entries or Body
   *
   * @param {Array<[string[], any]>}
   *
   * @return {object}
   */
  static json(value) {
    return Body.isBody(value) ? value.json() : Body.from(value).json()
  }

  /**
   * Return a FormData instance with data taken from given entries or Body
   *
   * @param {Array<[string[], any]>}
   *
   * @return {FormData}
   */
  static formData(value) {
    return Body.isBody(value) ? value.formData() : Body.from(value).formData()
  }

  /**
   * Create a new Body from given entries
   *
   * @param {Array<[string[], any]>}
   */
  constructor(entries) {
    this.__entries = entries.slice()
  }

  /**
   * Return an amount of entries and files in current Body instance
   *
   * @return {number}
   */
  get length() {
    return this.__entries.length
  }

  /**
   * Return a new Body that contains fields only
   *
   * @return {Body}
   */
  get fields() {
    return this.filter(field => isFile(field) === false)
  }

  /**
   * Return a new Body that contains files only
   *
   * @return {Body}
   */
  get files() {
    return this.filter(field => isFile(field))
  }

  [Symbol.iterator]() {
    return this.values()
  }

  /**
   * Return an iterator allows to go through the Body fields path
   */
  * paths() {
    for (const [path] of this.entries()) {
      yield path
    }
  }

  /**
   * Return an iterator allows to go through the Body fields name
   */
  * names() {
    for (const [path] of this.entries()) {
      yield toFieldname(path)
    }
  }

  /**
   * Return an iterator allows to go through the Body values
   */
  * values() {
    for (const [, value] of this.entries()) {
      yield value
    }
  }

  /**
   * Return an array of entries in current Body instance
   *
   * @return {Array<[string[], any]>}
   */
  entries = () => this.__entries

  /**
   * Create a new Body with the results of calling a provided function
   * on every entry in the calling Body
   *
   * @param {function} fn – Function to execute for each entry.
   *   It accepts four arguments:
   *     + {any} value – A value(s) of the current field.
   *     + {string} – Name of the current field.
   *     + {string[]} path – Path of the current entry.
   *     + {Array<[string[], any]>} entries – An array of entries of
   *       the current Body instance
   *
   * @return {Body}
   */
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

  /**
   * Execute a given callback for each entry of the Body instance
   *
   * @param {function} fn – Function to execute for each element.
   *   It accepts four arguments:
   *     + {any} value – A value(s) of the current field.
   *     + {string} – Name of the current field.
   *     + {string[]} path – Path of the current entry.
   *     + {Array<[string[], any]>} entries – An array of entries of
   *       the current Body instance
   *
   * @param {any} [ctx = null]
   *
   * @return {void}
   */
  forEach = (fn, ctx = null) => void this.map(fn, ctx)

  /**
   * Create a new Body with all entries that pass
   * the test implemented in given function
   *
   * @param {function} fn – Function to execute for each element,
   *   taking four arguments:
   *     + {any} value – A value(s) of the current field.
   *     + {string} – Name of the current field.
   *     + {string[]} path – Path of the current entry.
   *     + {Array<[string[], any]>} entries – An array of entries of
   *       the current Body instance
   *
   * @return {void}
   */
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

  /**
   * Return an object with data taken the current Body instance
   *
   * @return {object}
   */
  json = () => fromEntries(normalize(this.entries()))

  /**
   * Return a FormData with data taken the current Body instance
   *
   * @return {FormData}
   */
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
