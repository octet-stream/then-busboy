const {basename, extname} = require("path")
const {createReadStream} = require("fs")

const isPlainObject = require("./util/isPlainObject")

class File {
  /**
   * File class.
   *
   * @param {object} options
   *
   * @constructor
   *
   * @api private
   */
  constructor(options) {
    if (!isPlainObject(options)) {
      throw new TypeError("File options should be a plain object.")
    }

    const {path, enc, mime, originalFilename} = options

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

module.exports = File
