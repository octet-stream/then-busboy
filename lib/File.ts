import {createReadStream} from "fs"

export interface FileOptions {
  type?: string
  enc?: string
  lastModified?: number
}

export class File {
  path: string

  name: string

  type: string

  lastModified: number

  enc?: string

  constructor(path: string, name: string, options: FileOptions = {}) {
    this.path = path
    this.name = name
    this.type = options.type || ""
    this.lastModified = options.lastModified || Date.now()

    this.enc = options.enc
  }

  async* stream(): AsyncGenerator<Buffer, void, undefined> {
    yield* createReadStream(this.path)
  }
}
