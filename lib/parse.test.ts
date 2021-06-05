import {IncomingMessage} from "http"
import {promises as fs} from "fs"
import {Socket} from "net"

import test from "ava"

import {FormData, File, fileFromPath} from "formdata-node"
import {HttpError} from "http-errors"

import createRequest from "./__helper__/createRequest"
import createServer from "./__helper__/createServer"

import {parse} from "./parse"

interface Developer {
  name: string,
  isHireable: boolean
  skills: [string, ...string[]]
  dates: {
    createdAt: string
    updatedAt: string
    deletedAt?: string
  }
}

test("Parses empty form into empty object", async t => {
  const form = new FormData()

  const {body} = await createRequest(createServer(parse), form)

  t.deepEqual(body, {})
})

test("Parses regular form-data fields", async t => {
  const expected = {
    first: "First field",
    second: "Second field"
  }

  const form = new FormData()

  Object.entries(expected).forEach(([name, value]) => form.set(name, value))

  const {body} = await createRequest(createServer(parse), form)

  t.deepEqual(body, expected)
})

test("Casts values to their initial types by default", async t => {
  const expected = {
    number: 42,
    true: true,
    false: false,
    null: null
  }

  const form = new FormData()

  Object.entries(expected)
    .forEach(([name, value]) => form.set(name, String(value)))

  const {body} = await createRequest(createServer(parse), form)

  t.deepEqual(body, expected)
})

test("Ignores types casting when options.castTypes set to false", async t => {
  const expected = {
    number: "42",
    true: "true",
    false: "false",
    null: "null"
  }

  const form = new FormData()

  Object.entries(expected).forEach(([name, value]) => form.set(name, value))

  const {body} = await createRequest(
    createServer(parse, {castTypes: false}),

    form
  )

  t.deepEqual(body, expected)
})

test("Parses form with a File", async t => {
  const expected = "My hovercraft is full of eels"

  const form = new FormData()

  form.set("file", new File([expected], "file.txt"))

  const {body} = await createRequest(createServer(parse), form)

  t.deepEqual(body, {file: expected})
})

test("Parses form with both files and fields", async t => {
  const expected = {
    field: "Field content",
    file: await fs.readFile("license", "utf-8")
  }

  const form = new FormData()

  form.set("field", expected.field)
  form.set("file", await fileFromPath("license"))

  const {body} = await createRequest(createServer(parse), form)

  t.deepEqual(body, expected)
})

test("Supports parsing of nested objects", async t => {
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

  const form = new FormData()

  form.set("name", "John Doe")
  form.set("isHireable", false)
  form.set("skills[0]", "JavaScript")
  form.set("skills[1]", "TypeScript")
  form.set("skills[2]", "CoffeeScript")
  form.set("dates[createdAt]", date)
  form.set("dates[updatedAt]", date)
  form.set("dates[deletedAt]", String(null))

  const {body} = await createRequest(createServer(parse), form)

  t.deepEqual<typeof expected>(body, expected)
})

test("Support parsing of collections", async t => {
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

  const form = new FormData()

  form.set("[0][name]", "John Doe")
  form.set("[0][isHireable]", true)
  form.set("[0][skills][0]", "JavaScript")
  form.set("[0][skills][1]", "TypeScript")
  form.set("[0][skills][2]", "React")
  form.set("[0][skills][3]", "MobX")
  form.set("[0][skills][4]", "Node.js")
  form.set("[0][dates][createdAt]", date)
  form.set("[0][dates][updatedAt]", date)
  form.set("[0][dates][deletedAt]", String(null))
  form.set("[1][name]", "Max Doe")
  form.set("[1][isHireable]", false)
  form.set("[1][skills][0]", "TypeScript")
  form.set("[1][skills][1]", "React")
  form.set("[1][skills][2]", "XState")
  form.set("[1][skills][3]", "Node.js")
  form.set("[1][skills][4]", "Rust")
  form.set("[1][dates][createdAt]", date)
  form.set("[1][dates][updatedAt]", date)
  form.set("[1][dates][deletedAt]", String(null))

  const {body} = await createRequest(createServer(parse), form)

  t.deepEqual<typeof expected>(body, expected)
})

test("Throws error when file size limit exceeded", async t => {
  const form = new FormData()

  form.set("file", await fileFromPath("license"))

  const {error} = await createRequest(
    createServer(parse, {
      limits: {
        fileSize: 3 // set limit to 1 byte
      }
    }),

    form
  )

  t.is(
    (error as unknown as HttpError).status, 413,

    "The error status must be 413"
  )
  t.is(
    (error as any).text,

    "File size limit exceeded: Available up to 3 bytes per file."
  )
})

test("Throws an error when field size limit exceeded", async t => {
  const form = new FormData()

  form.set("field", "Some a very very long string as field's value")

  const {error} = await createRequest(
    createServer(parse, {
      limits: {
        fieldSize: 4
      }
    }),

    form
  )

  t.is(
    (error as any).text,

    "Field size limit exceeded: Available up to 4 bytes per field."
  )
})

test("Throws an error when parts limit exceeded", async t => {
  const form = new FormData()

  form.set("field", "First")
  form.set("file", await fileFromPath("license"))

  const {error} = await createRequest(
    createServer(parse, {
      limits: {
        parts: 1
      }
    }),

    form
  )

  t.is((error as any).text, "Parts limit exceeded: Available up to 1 parts.")
})

test("Throws an error when given amount of fields exceeded limit", async t => {
  const form = new FormData()

  form.set("first", "First")
  form.set("second", "Second")

  const {error} = await createRequest(
    createServer(parse, {
      limits: {
        fields: 1
      }
    }),

    form
  )

  t.is((error as any).text, "Fields limit exceeded: Available up to 1 fields.")
})

test("Throws an error wnen given amount of files exceeded limit", async t => {
  const form = new FormData()

  form.set("license", await fileFromPath("license"))
  form.set("readme", await fileFromPath("readme.md"))

  const {error} = await createRequest(
    createServer(parse, {
      limits: {
        files: 1
      }
    }),

    form
  )

  t.is((error as any).text, "Files limit exceeded: Available up to 1 files.")
})

test("Field name format error has correct HTTP status", async t => {
  const form = new FormData()

  form.set("field[", "Broken field part :(")

  const {error} = await createRequest(createServer(parse), form)

  t.is((error as unknown as HttpError).status, 400)
})

test("Throws an error on incorrect field name format", async t => {
  const form = new FormData()

  form.set("field[", "Broken field part :(")

  const {error} = await createRequest(createServer(parse), form)

  t.is((error as any).text, "Incorrect field name format at: field[")
})

test("Throws an error on incorrect field name format in file part", async t => {
  const form = new FormData()

  form.set("files[]", new File(["Broken file part :("], "file.txt"))

  const {error} = await createRequest(createServer(parse), form)

  t.is((error as any).text, "Incorrect field name format at: files[]")
})

test("Throws an error for empty field name", async t => {
  const form = new FormData()

  form.set("", "Empty field name")

  const {error} = await createRequest(createServer(parse), form)

  t.is((error as any).text, "Field name cannot be empty.")
})

test("Error thrown for empty field name has correct HTTP status", async t => {
  const form = new FormData()

  form.set("", "Empty field name")

  const {error} = await createRequest(createServer(parse), form)

  t.is((error as unknown as HttpError).status, 400)
})

test("Throws TypeError on incorrect request argument", async t => {
  // @ts-ignore
  await t.throwsAsync(parse({}), {
    instanceOf: TypeError,
    message: "Expected request argument to be "
      + "an instance of http.IncomingMessage."
  })
})

test("Throws TypeError when options argument is not an object", async t => {
  const request = new IncomingMessage(new Socket())

  // @ts-ignore
  await t.throwsAsync(parse(request, []), {
    instanceOf: TypeError,
    message: "Expected options argument to be an object."
  })
})
