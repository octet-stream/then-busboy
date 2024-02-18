import {EventEmitter} from "node:events"

import test from "ava"

import {
  createEventIterator,
  EntriesEvents
} from "./createEntriesIterator.js"

test("Iterates over event emitter", async t => {
  const expected = [
    [["name"], "John Doe"],
    [["email"], "john.doe@example.com"],
    [["isHireable"], "true"]
  ]

  const ee = new EventEmitter()

  setImmediate(() => {
    expected.map(entry => ee.emit(EntriesEvents.Entry, entry))

    ee.emit(EntriesEvents.End)
  })

  const actual: unknown[] = []
  for await (const entry of createEventIterator(ee)) {
    actual.push(entry)
  }

  t.deepEqual(actual, expected)
})
