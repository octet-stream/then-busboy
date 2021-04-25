import {createReadStream} from "fs"
import {Readable} from "stream"

export interface FileOptions {
  type?: string
  enc?: string
}

export class File {
  path: string

  name: string

  type: string

  enc?: string

  constructor(path: string, name: string, options: FileOptions = {}) {
    this.path = path
    this.name = name
    this.type = options.type || ""
    this.enc = options.enc
  }

  stream(): Readable {
    return createReadStream(this.path)
  }
}
