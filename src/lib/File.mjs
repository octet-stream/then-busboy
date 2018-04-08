import {createWriteStream} from "fs"
import {basename, extname} from "path"

import Stream from "stream"

import invariant from "@octetstream/invariant"

import isPlainObject from "./util/isPlainObject"
import isString from "./util/isString"
import getType from "./util/getType"

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
    invariant(
      !isPlainObject(options), TypeError,
      "File options should be a plain object. Received", getType(options)
    )

    const {contents, filename, enc, mime} = options

    invariant(!contents, "File contents required.")

    invariant(
      !(contents instanceof Stream), TypeError,
      "Contents should be a Stream. Received %s", getType(contents)
    )

    invariant(!filename, "Filename required.")

    invariant(
      !isString(filename), TypeError,
      "Filename should be a string. Received %s", getType(filename)
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

    const ext = extname(filename)
    const base = basename(filename, ext)

    this.__contents = contents
    this.__stream = contents
    this.__filename = basename(filename)
    this.__basename = base
    this.__extname = ext
    this.__mime = mime
    this.__enc = enc

    // this.__path = join(tmpdir(), `${nanoid()}_${this.filename}`)
    this.__path = filename

    this.toJSON = this.toJSON.bind(this)
    this.inspect = this.inspect.bind(this)
  }

  get contents() {
    return this.__contents
  }

  get stream() {
    return this.__stream
  }

  get filename() {
    return this.__filename
  }

  get basename() {
    return this.__basename
  }

  get extname() {
    return this.__extname
  }

  get enc() {
    return this.__enc
  }

  get mime() {
    return this.__mime
  }

  get path() {
    return this.__path
  }

  /**
   * Read file contents from a stream
   *
   * @return {Promise<Buffer>}
   */
  read = () => new Promise((resolve, reject) => {
    const data = []

    const onReadable = () => {
      const ch = this.contents.read()

      if (ch != null) {
        data.push(ch)
      }
    }

    const onEnd = () => resolve(Buffer.concat(data))

    this.contents
      .on("error", reject)
      .on("readable", onReadable)
      .on("end", onEnd)
  })

  /**
   * Write file contents to a disk.
   *
   * @param {string} path – path to where contents will be stored
   *  (default – this.path)
   *
   * @return {Promise}
   */
  write = path => new Promise((resolve, reject) => {
    if (!path || !isString(path)) {
      path = this.path
    }

    // Prevent writing file to its source
    if (this.contents.path === path) {
      return resolve()
    }

    this.contents
      .on("error", reject)
      .on("end", resolve)
      .pipe(createWriteStream(path))
  })

  toJSON() {
    return this.inspect()
  }

  toString() {
    return this.inspect()
  }

  inspect() {
    return `<File: ${this.filename}>`
  }
}

export default File
