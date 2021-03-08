import {Readable} from "stream"
import {inspect} from "util"

interface FileConfig {
  path: string

  enc: string

  mime: string

  originalFilename: string
}

declare class File {
  originalFilename: string

  filename: string

  basename: string

  extname: string

  mime: string

  enc: string

  path: string

  stream(): Readable

  [Symbol.toStringTag]: string

  constructor(options?: FileConfig)

  toJSON(): string

  toString(): string

  inspect(): string

  [inspect.custom](): string
}

export default File
