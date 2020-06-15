import {basename, extname} from "path"
import {createReadStream} from "fs"

import invariant from "@octetstream/invariant"

import isPlainObject from "lib/util/isPlainObject"
import isString from "lib/util/isString"
import getType from "lib/util/getType"

class File {
  /**
   * File class.
   *
   * @param {object} options
   *
   * @constructor
   *
   * @api public
   */
  constructor(options) {
    invariant(
      !isPlainObject(options), TypeError,
      "File options should be a plain object. Received", getType(options)
    )

    const {path, enc, mime, originalFilename} = options

    invariant(!path, "Filename required.")

    invariant(
      !isString(path), TypeError,
      "Filename should be a string. Received %s", getType(path)
    )

    invariant(!enc, "File encoding required.")

    invariant(
      !isString(enc), TypeError,
      "File encoding should be a string. Received %s", getType(enc)
    )

    invariant(!mime, "File mime type required.")

    invariant(
      !isString(mime), TypeError,
      "File mime type should be a string. Received %s", getType(mime)
    )

    const ext = extname(path)
    const base = basename(path, ext)

    this.__stream = createReadStream(path)

    this.originalFilename = basename(originalFilename)
    this.filename = basename(path)
    this.basename = base
    this.extname = ext
    this.mime = mime
    this.enc = enc
    this.path = path

    this.toJSON = this.toJSON.bind(this)
    this.inspect = this.inspect.bind(this)
  }

  stream() {
    return this.__stream
  }

  get [Symbol.toStringTag]() {
    return `File: ${this.filename}`
  }

  toJSON() {
    return `[File: ${this.filename}]`
  }

  toString() {
    return `[File: ${this.filename}]`
  }

  inspect() {
    return `[File: ${this.filename}]`
  }
}

export default File
export const isFile = File.isFile
