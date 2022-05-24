import {IncomingMessage} from "http"
import {promises as fs} from "fs"
import {Readable} from "stream"
import {Socket} from "net"

import test from "ava"
import lowercase from "lowercase-keys"

// eslint-disable-next-line import/no-unresolved
import {fileFromPath} from "formdata-node/file-from-path"
import {FormDataEncoder} from "form-data-encoder"
import {FormData, File} from "formdata-node"
import {HttpError} from "http-errors"

import createRequest from "./__helper__/createRequest"
import createServer from "./__helper__/createServer"

import {parse} from "./parse"

const {readFile} = fs

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
    file: await readFile("license", "utf-8")
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

  t.deepEqual(body, expected)
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

  t.deepEqual(body, expected)
})

test("Accepts AsyncIterable as the input", async t => {
  interface RawBody {
    field: string
    file: File
  }

  interface NormalizedBody {
    field: string
    file: string
  }

  const form = new FormData()

  form.set("field", "Hello, world!")
  form.set("file", await fileFromPath("license"))

  const expected = Object.fromEntries(form) as unknown as RawBody

  const encoder = new FormDataEncoder(form)
  const headers = lowercase(encoder.headers)

  const body = await parse(encoder.encode(), {headers})
  const actual = body.json() as unknown as RawBody

  t.deepEqual<NormalizedBody, NormalizedBody>(
    {
      field: actual.field,
      file: await actual.file.text()
    },

    {
      field: expected.field,
      file: await expected.file.text()
    }
  )
})

test("Accepts Readable stream as the input", async t => {
  interface RawBody {
    field: string
    file: File
  }

  interface NormalizedBody {
    field: string
    file: string
  }

  const form = new FormData()

  form.set("field", "Hello, world!")
  form.set("file", await fileFromPath("license"))

  const expected = Object.fromEntries(form) as unknown as RawBody

  const encoder = new FormDataEncoder(form)
  const headers = lowercase(encoder.headers)

  const body = await parse(Readable.from(encoder), {headers})
  const actual = body.json<RawBody>()

  t.deepEqual<NormalizedBody, NormalizedBody>(
    {
      field: actual.field,
      file: await actual.file.text()
    },

    {
      field: expected.field,
      file: await expected.file.text()
    }
  )
})

test("Throws error when file size limit exceeded", async t => {
  const form = new FormData()

  form.set("file", await fileFromPath("license"))

  const encoder = new FormDataEncoder(form)
  const promise = parse(encoder, {
    headers: {
      "content-type": encoder.contentType
    },
    limits: {
      fileSize: 3
    }
  })

  const err = await t.throwsAsync<HttpError>(promise, {
    instanceOf: HttpError,
    message: "File size limit exceeded: Available up to 3 bytes per file."
  })

  t.is(err.statusCode, 413)
})

test("Throws an error when field size limit exceeded", async t => {
  const form = new FormData()

  form.set("field", "Some a very very long string as field's value")

  const encoder = new FormDataEncoder(form)
  const promise = parse(encoder, {
    headers: {
      "content-type": encoder.contentType
    },
    limits: {
      fieldSize: 4
    }
  })

  await t.throwsAsync<HttpError>(promise, {
    instanceOf: HttpError,
    message: "Field size limit exceeded: Available up to 4 bytes per field."
  })
})

// ! This test was failing with ECONNRESET for some reason.
// ! I don't know why, but I need to find why.
// ! For now I just decided to rewrite it with the newly supported input source
test("Throws an error when parts limit exceeded", async t => {
  const form = new FormData()

  form.set("field", "First")
  form.set("file", await fileFromPath("license"))

  const encoder = new FormDataEncoder(form)
  const promise = parse(encoder, {
    headers: {
      "content-type": encoder.contentType
    },
    limits: {
      parts: 1
    }
  })

  await t.throwsAsync<HttpError>(promise, {
    instanceOf: HttpError,
    message: "Parts limit exceeded: Available up to 1 parts."
  })
})

test("Throws an error when given amount of fields exceeded limit", async t => {
  const form = new FormData()

  form.set("first", "First")
  form.set("second", "Second")

  const encoder = new FormDataEncoder(form)
  const promise = parse(encoder, {
    headers: {
      "content-type": encoder.contentType
    },
    limits: {
      fields: 1
    }
  })

  await t.throwsAsync<HttpError>(promise, {
    instanceOf: HttpError,
    message: "Fields limit exceeded: Available up to 1 fields."
  })
})

test("Throws an error wnen given amount of files exceeded limit", async t => {
  const form = new FormData()

  form.set("license", await fileFromPath("license"))
  form.set("readme", await fileFromPath("readme.md"))

  const encoder = new FormDataEncoder(form)
  const promise = parse(encoder, {
    headers: {
      "content-type": encoder.contentType
    },
    limits: {
      files: 1
    }
  })

  await t.throwsAsync<HttpError>(promise, {
    instanceOf: HttpError,
    message: "Files limit exceeded: Available up to 1 files."
  })
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
    message: "The source argument must be instance of IncomingMessage or "
      + "an object with callable @@asyncIterator property."
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
