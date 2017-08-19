import {createWriteStream} from "fs"
import {join} from "path"
import {tmpdir} from "os"

import Stream from "stream"

import invariant from "@octetstream/invariant"
import nanoid from "nanoid"

class File {
  /**
   * File class.
   *
   * @param {object} file
   *
   * @constructor
   */
  constructor({contents, filename, enc, mime} = {}) {
    invariant(!contents, TypeError, "File contents required.")

    invariant(
      !(contents instanceof Stream), TypeError, "Contents should be a Stream."
    )

    this.__contents = contents
    this.__filename = filename
    this.__mime = mime
    this.__enc = enc

    this.__path = join(tmpdir(), nanoid(), this.filename)
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

  get enc() {
    return this.__enc
  }

  get mime() {
    return this.__mime
  }

  /**
   * Read file contents from a stream
   *
   * @return {Promise<Buffer>}
   */
  read = () => new Promise((resolve, reject) => {
    const data = []

    const onData = ch => data.push(ch)

    const onEnd = () => resolve(Buffer.concat(data))

    this.contents
      .on("error", reject)
      .on("data", onData)
      .on("end", onEnd)
  })

  write = path => new Promise((resolve, reject) => {
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
