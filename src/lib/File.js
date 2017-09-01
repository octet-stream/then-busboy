import {createWriteStream} from "fs"
import {isString} from "util"
import {tmpdir} from "os"
import {join, basename, extname} from "path"

import Stream from "stream"

import invariant from "@octetstream/invariant"
import nanoid from "nanoid"

import getType from "lib/util/getType"

class File {
  /**
   * File class.
   *
   * @param {object} file
   *
   * @constructor
   */
  constructor({contents, filename, enc, mime} = {}) {
    invariant(!contents, "File contents required.")

    invariant(
      !(contents instanceof Stream), TypeError,
      "Contents should be a Stream. Received %s", getType(contents)
    )

    const ext = extname(filename)
    const base = basename(filename, ext)

    this.__contents = contents
    this.__filename = filename
    this.__basename = base
    this.__extname = ext
    this.__mime = mime
    this.__enc = enc

    this.__path = join(tmpdir(), `${nanoid()}_${this.filename}`)
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

    const onData = ch => void data.push(ch)

    const onEnd = () => resolve(Buffer.concat(data))

    this.contents
      .on("error", reject)
      .on("data", onData)
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

    this.contents
      .on("erorr", reject)
      .on("end", resolve)
      .pipe(createWriteStream(path))
  })

  inspect() {
    return `[File: ${this.filename}]`
  }
}

export default File
