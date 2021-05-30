import test from "ava"

import {FormData, File} from "formdata-node"

import {Body} from "./Body"
import {Field} from "./Field"
import {BusboyFile} from "./File"
import {BusboyEntries} from "./BusboyEntries"

test("Creates an empty Body", t => {
  const body = new Body([])

  t.is(body.length, 0)
})

test("Creates Body with scalar field", t => {
  const body = new Body([
    [["field"], "value"]
  ])

  const [actual] = [...body.values()]

  t.true(actual instanceof Field)
  t.is((actual as Field).valueOf(), "value")
})

test("Creates Body with with a File (BusboyFile)", t => {
  const file = new BusboyFile(["Content"], "file.txt")

  const body = new Body([[["file"], file]])

  const [actual] = [...body.values()]

  t.true(actual instanceof BusboyFile)
})

test("Creates Body with spec-compatible File", t => {
  const file = new File(["Content"], "file.txt")

  const body = new Body([[["file"], file]])

  const [actual] = [...body.values()]

  t.true(actual instanceof File)
})

test("Entries can be converted back to an array", t => {
  const expected: BusboyEntries = [
    [["firstField"], "First value"],
    [["secondField"], "Second value"]
  ]

  const body = new Body(expected)

  const actual = [...body].map(entry => (entry as unknown as Field).valueOf())

  t.deepEqual([...body], actual)
})

test(".json() creates an object from entries", t => {
  const expected = {
    firstField: "First value"
  }

  const entries: BusboyEntries = [
    [["firstField"], "First value"]
  ]

  const body = new Body(entries)

  t.deepEqual(body.json(), expected)
})

test(".json() returns nested object", t => {
  const date = Date.now()

  const expected = {
    name: "John Doe",
    skills: ["JavaScript", "TypeScript", "CoffeeScript"],
    dates: {
      createdAt: date,
      updatedAt: date,
      deletedAt: null
    }
  }

  const entries: BusboyEntries = [
    [["name"], "John Doe"],
    [["skills", 0], "JavaScript"],
    [["skills", 1], "TypeScript"],
    [["skills", 2], "CoffeeScript"],
    [["dates", "createdAt"], date],
    [["dates", "updatedAt"], date],
    [["dates", "deletedAt"], null]
  ]

  const object = new Body(entries).json()
})

test(".formData() returns FormData", t => {
  const entries: BusboyEntries = [
    [["firstField"], "First value"]
  ]

  const body = new Body(entries)

  t.true(body.formData() instanceof FormData)
})

test(".formData() returns FormData with entries from Body", t => {
  const entries: BusboyEntries = [
    [["firstField"], "First value"],
    [["secondField"], "Second value"]
  ]

  const form = new Body(entries).formData()

  t.deepEqual([...form], entries.map(([[key], value]) => [key, value]))
})
