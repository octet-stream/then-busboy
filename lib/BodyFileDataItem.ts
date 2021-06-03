import {File} from "formdata-node"

import {BodyFile} from "./BodyFile"

export interface BodyFileDataItemOptions {
  file: File
  path: string
  enc?: string
}

export class BodyFileDataItem implements BodyFile {
  readonly #file: File

  readonly #path: string

  readonly #enc?: string

  constructor({file, path, enc}: BodyFileDataItemOptions) {
    this.#file = file
    this.#path = path
    this.#enc = enc
  }

  get [Symbol.toStringTag](): string {
    return "File"
  }

  get name(): string {
    return this.#file.name
  }

  get size(): number {
    return this.#file.size
  }

  get type(): string {
    return this.#file.type
  }

  get lastModified(): number {
    return this.#file.lastModified
  }

  get path(): string {
    return this.#path
  }

  get enc(): string | undefined {
    return this.#enc
  }

  stream() {
    return this.#file.stream()
  }

  arrayBuffer() {
    return this.#file.arrayBuffer()
  }

  text() {
    return this.#file.text()
  }
}
