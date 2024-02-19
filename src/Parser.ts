import type {ReadableStream} from "node:stream/web"
import {EventEmitter, on} from "node:events"
import {IncomingMessage} from "node:http"
import {Readable} from "node:stream"

import busboy from "busboy"

import {fieldNameToPath} from "./utils/fieldNameToPath.js"
import {castValueType} from "./utils/castValueType.js"

export enum EntriesEvents {
  Entry = "entry",
  End = "end",
  Error = "error"
}

export type EntryPath = Array<string | number>

export type Entry = [path: EntryPath, value: unknown]

export type ParserInput =
  | IncomingMessage
  | ReadableStream
  | Readable
  | AsyncIterable<Uint8Array | Buffer | string>

export interface BaseParserOptions extends busboy.BusboyConfig {
  /**
   * Indicates whether then-busboy should cast fields values to their initial type
   */
  castTypes?: boolean
}

type ParserOptions<
  TInput extends ParserInput
> = TInput extends IncomingMessage
  ? Omit<BaseParserOptions, "headers">
  : BaseParserOptions

export class Parser<TInput extends ParserInput> extends EventEmitter {
  #pending = 0

  #isBodyRead = false

  #busboy: busboy.Busboy

  #input: Readable

  #castValues: boolean

  constructor(input: TInput, options: ParserOptions<TInput>) {
    super()

    const {castTypes = false, ...params}: BaseParserOptions = {...options}

    if (input instanceof IncomingMessage) {
      params.headers = input.headers
    }

    this.#castValues = castTypes
    this.#input = Readable.from(input)
    this.#busboy = busboy(params)
      .once("error", error => { this.emit(EntriesEvents.Error, error) })
      .once("close", () => { this.#isBodyRead = true })
      .on("field", this.#onField)
      .on("file", this.#onFile)
  }

  /**
   * Consumes a signle file
   */
  #onFile = (/* name: string, stream: Readable, info: busboy.FileInfo */) => {
    // this.#pending++

    // const path = fieldNameToPath(name)

    throw new Error("Not implemented")
  }

  /**
   * Consumes a single field
   */
  #onField = (name: string, value: string) => {
    this.#pending++

    const path = fieldNameToPath(name)

    // TODO: Restore field info support
    this.emit(EntriesEvents.Entry, [
      path, this.#castValues ? castValueType(value) : value
    ])
  }

  async* [Symbol.asyncIterator]() {
    if (this.#isBodyRead) {
      throw new Error("Body already consumed")
    }

    const controller = new AbortController()

    // Cancel iteration when `end` event occurs
    this.once(EntriesEvents.End, () => controller.abort())

    this.#input.pipe(this.#busboy)

    const iterator = on(this, EntriesEvents.Entry, {signal: controller.signal})

    try {
      for await (const [entry] of iterator) {
        yield entry

        this.#pending--
      }
    } catch (error) {
      // Ignore abort error since we use it to signal end of the entries queue
      if ((error as NodeJS.ErrnoException).code !== "ABORT_ERR") {
        throw error
      }
    }
  }
}
