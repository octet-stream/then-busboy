import test from "ava"

import {FormData, File} from "formdata-node"

import isFile from "./util/isFile.js"
import isField from "./util/isField.js"

import {BodyFileDataItem} from "./BodyFileDataItem.js"
import {Body, BodyRawEntries} from "./Body.js"
import {BodyField} from "./BodyField.js"

interface Developer {
  name: string,
  isHireable: boolean
  skills: [string, ...string[]]
  dates: {
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
  }
}

test("Creates an empty Body", t => {
  const body = new Body([])

  t.is(body.length, 0)
})

test("Empty body can be converted to an object", t => {
  const body = new Body([])

  t.deepEqual(body.json(), {})
})

test("Empty body can be converted to a FormData", t => {
  const body = new Body([])

  const actual = body.formData()

  t.true(actual instanceof FormData, "Must be a FormData instance")
  t.deepEqual([...actual], [], "Must be empty")
})

test("Creates Body with scalar field", t => {
  const body = new Body([
    [["field"], "value"]
  ])

  const [actual] = [...body.values()]

  t.true(actual instanceof BodyField)
  t.is((actual as BodyField).valueOf(), "value")
})

test("Creates Body with a BodyFileDataItem", t => {
  const file = new BodyFileDataItem({
    file: new File(["Some content"], "file.txt"),
    path: "/path/to/a/file"
  })

  const body = new Body([[["file"], file]])

  const [actual] = [...body.values()]

  t.true(actual instanceof BodyFileDataItem)
})

test("Creates Body with spec-compatible File", t => {
  const file = new File(["Content"], "file.txt")

  const body = new Body([[["file"], file]])

  const [actual] = [...body.values()]

  t.true(actual instanceof File)
})

test("Entries can be converted back to an array", t => {
  const expected: BodyRawEntries = [
    [["firstField"], "First value"],
    [["secondField"], "Second value"]
  ]

  const body = new Body(expected)

  const actual = [...body].map(entry => (entry as any as BodyField).valueOf())

  t.deepEqual([...body], actual)
})

test(".json() creates an object from entries", t => {
  const expected = {
    firstField: "First value"
  }

  const entries: BodyRawEntries = [
    [["firstField"], "First value"]
  ]

  const body = new Body(entries)

  t.deepEqual(body.json(), expected)
})

test(".json() returns nested object", t => {
  const date = new Date().toISOString()

  const expected: Developer = {
    name: "John Doe",
    isHireable: false,
    skills: ["JavaScript", "TypeScript", "CoffeeScript"],
    dates: {
      createdAt: date,
      updatedAt: date,
      deletedAt: null
    }
  }

  const entries: BodyRawEntries = [
    [["name"], "John Doe"],
    [["isHireable"], false],
    [["skills", 0], "JavaScript"],
    [["skills", 1], "TypeScript"],
    [["skills", 2], "CoffeeScript"],
    [["dates", "createdAt"], date],
    [["dates", "updatedAt"], date],
    [["dates", "deletedAt"], null]
  ]

  const actual = new Body(entries).json()

  t.deepEqual(actual, expected)
})

test(".json() returns collection", t => {
  const date = new Date().toISOString()

  const expected: Developer[] = [
    {
      name: "John Doe",
      isHireable: true,
      skills: ["JavaScript", "TypeScript", "React", "MobX", "Node.js"],
      dates: {
        createdAt: date,
        updatedAt: date,
        deletedAt: null
      }
    },
    {
      name: "Max Doe",
      isHireable: false,
      skills: ["TypeScript", "React", "XState", "Node.js", "Rust"],
      dates: {
        createdAt: date,
        updatedAt: date,
        deletedAt: null
      }
    }
  ]

  const entries: BodyRawEntries = [
    [[0, "name"], "John Doe"],
    [[0, "isHireable"], true],
    [[0, "skills", 0], "JavaScript"],
    [[0, "skills", 1], "TypeScript"],
    [[0, "skills", 2], "React"],
    [[0, "skills", 3], "MobX"],
    [[0, "skills", 4], "Node.js"],
    [[0, "dates", "createdAt"], date],
    [[0, "dates", "updatedAt"], date],
    [[0, "dates", "deletedAt"], null],
    [[1, "name"], "Max Doe"],
    [[1, "isHireable"], false],
    [[1, "skills", 0], "TypeScript"],
    [[1, "skills", 1], "React"],
    [[1, "skills", 2], "XState"],
    [[1, "skills", 3], "Node.js"],
    [[1, "skills", 4], "Rust"],
    [[1, "dates", "createdAt"], date],
    [[1, "dates", "updatedAt"], date],
    [[1, "dates", "deletedAt"], null],
  ]

  const actual = new Body(entries).json()

  t.deepEqual(actual, expected)
})

test(".formData() returns FormData", t => {
  const entries: BodyRawEntries = [
    [["firstField"], "First value"]
  ]

  const body = new Body(entries)

  t.true(body.formData() instanceof FormData)
})

test(".formData() returns FormData with entries from Body", t => {
  const entries: BodyRawEntries = [
    [["firstField"], "First value"],
    [["secondField"], "Second value"]
  ]

  const form = new Body(entries).formData()

  t.deepEqual([...form], entries.map(([[key], value]) => [key, value]))
})

test("Static .formData() method returns FormData", t => {
  t.true(Body.formData([]) instanceof FormData)
})

test("Static .formData() method takes entries as the argument", t => {
  const actual = Body.formData([[["field"], "Some value"]])

  t.deepEqual([...actual], [["field", "Some value"]])
})

test("Static .fromData() method takes another Body as the argument", t => {
  const body = new Body([[["field"], "Some value"]])

  t.deepEqual([...Body.formData(body)], [["field", "Some value"]])
})

test("Static .json() method returns an object", t => {
  t.deepEqual(Body.json([]), {})
})

test("Static .json() method takes entries as the argument", t => {
  const actual = Body.json([[["field"], "Some value"]])

  t.deepEqual(actual, {field: "Some value"})
})

test("Static .json() method takes another Body as the argument", t => {
  const body = new Body([[["field"], "Some value"]])

  t.deepEqual(Body.json(body), {field: "Some value"})
})

test(".files() Returns Body with only files in it", t => {
  const entries: BodyRawEntries = [
    [["first"], "First field"],
    [["second"], new File(["Second field"], "file.txt", {type: "text/plain"})],
    [["third"], "Third field"]
  ]

  const actual = new Body(entries).files()

  t.true([...actual.values()].every(isFile))
})

test(".fields() Returns Body with only files in it", t => {
  const entries: BodyRawEntries = [
    [["first"], "First field"],
    [["second"], new File(["Second field"], "file.txt", {type: "text/plain"})],
    [["third"], "Third field"]
  ]

  const actual = new Body(entries).fields()

  t.true([...actual.values()].every(isField))
})

test(".keys() returns an iterator allowing to go through keys", t => {
  const entries: BodyRawEntries = [
    [["firstField"], "First value"],
    [["secondField"], "Second value"]
  ]

  t.deepEqual([...new Body(entries).keys()], entries.map(([path]) => path))
})

test("Symbol.toStringTag returns correct string", t => {
  const body = new Body([])

  t.is(body[Symbol.toStringTag], "Body")
})
