import type {EventEmitter} from "node:events"
import {on} from "node:events"

export enum EntriesEvents {
  Error = "error",
  Entry = "entry",
  End = "end"
}

export type Entry = [path: string[], unknown]

export async function* createEventIterator(
  entries: EventEmitter
): AsyncGenerator<Entry, void, undefined> {
  const controller = new AbortController()

  // Cancel iteration when `end` event occurs
  entries.once(EntriesEvents.End, () => controller.abort())

  const iterator = on(entries, EntriesEvents.Entry, {
    signal: controller.signal
  })

  try {
    for await (const entry of iterator) {
      yield entry[0]
    }
  } catch (error) {
    // Ignore abort error since we use it to signal end of the entries queue
    if ((error as NodeJS.ErrnoException).code !== "ABORT_ERR") {
      throw error
    }
  }
}
