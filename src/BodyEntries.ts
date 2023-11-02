import {EventEmitter} from "node:events"

import type * as ti from "typed-emitter"

import type {BodyEntry} from "./Body.js"
import {Body} from "./Body.js"

type BodyEntriesEventsList = {
  error(error: unknown): void
  finish(body: Body): void
}

type BodyEntriesEvents = ti.default<BodyEntriesEventsList>

export class BodyEntries extends (EventEmitter as new () => BodyEntriesEvents) {
  #entries: BodyEntry[] = []

  #pending = 0

  #isBodyRead = false

  /**
   * Enqueues a new pending body entry.
   * You **nust** call this method *before* you add an entry to the list via `.pull()` method.
   */
  enqueue(): void {
    this.#pending += 1
  }

  /**
   * Adds a new body entry to internal list
   *
   * @param entry An entry to add
   */
  pull(entry: BodyEntry): void {
    this.#entries.push(entry)
    this.#pending -= 1

    if (this.#pending < 1) {
      this.finish()
    }
  }

  /**
   * Finishes body processing and calls finish event.
   *
   * @param isBodyRead And optional flag indicating that the request body is fully read. Can only be true if present.
   */
  finish(isBodyRead?: true) {
    if (isBodyRead === true) {
      this.#isBodyRead = isBodyRead
    }

    if (this.#isBodyRead === true && this.#pending < 1) {
      this.emit("finish", new Body(this.#entries))
    }
  }
}
