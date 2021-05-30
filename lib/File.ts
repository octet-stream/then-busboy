import {basename} from "path"

import {File, FileOptions} from "formdata-node"

import isPlainObject from "./util/isPlainObject"

export interface BusboyFileOptions extends FileOptions {
  enc?: string
}

export class BusboyFile extends File {
  readonly path: string

  readonly enc?: string

  constructor(parts: any[], path: string, options?: BusboyFileOptions)
  constructor(
    parts: any[],
    path: string,
    name: string,
    options?: BusboyFileOptions
  )
  constructor(
    parts: any[],
    path: string,
    nameOrOptions?: string | BusboyFileOptions,
    options?: BusboyFileOptions
  ) {
    let name: string | undefined
    if (isPlainObject(nameOrOptions)) {
      [options, name] = [nameOrOptions, undefined]
    } else {
      [name, options] = [nameOrOptions, undefined]
    }

    const {enc, ...rest}: BusboyFileOptions = options || {}

    super(parts, basename(name || path), rest)

    this.path = path
    this.enc = enc
  }

  get [Symbol.toStringTag](): string {
    return "File"
  }
}
