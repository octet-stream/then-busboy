import test from "ava"

import request from "supertest"

import {readFile} from "promise-fs"

import mockHeader from "test/helper/mockHeader"
import mockRequest from "test/helper/mockRequest"
import mockServer from "test/helper/mockServer"

import isPlainObject from "lib/util/isPlainObject"
import parse from "lib/parse"

test("Should return a promise", t => {
  const req = mockRequest()

  t.true(parse(req) instanceof Promise)

  req.emit("end")
})

test("Should just resolve a plain object", async t => {
  const {body} = await request(mockServer(parse)())
    .post("/")
    .set("content-type", mockHeader)

  t.true(isPlainObject(body))
})

test("Should return an expected object", async t => {
  const {body} = await request(mockServer(parse)())
    .post("/")
    .set("content-type", mockHeader)
    .field("subjects[0][firstName]", "John")
    .field("subjects[0][lastName]", "Doe")
    .field("subjects[0][dob][day]", "1")
    .field("subjects[0][dob][month]", "Jan.")
    .field("subjects[0][dob][year]", "1989")
    .field("subjects[0][skills][0]", "Node.js")
    .field("subjects[0][skills][1]", "CoffeeScript")
    .field("subjects[0][skills][2]", "JavaScript")
    .field("subjects[0][skills][3]", "Babel")
    .field("subjects[1][firstName]", "Max")
    .field("subjects[1][lastName]", "Doe")
    .field("subjects[1][dob][day]", "12")
    .field("subjects[1][dob][month]", "Mar.")
    .field("subjects[1][dob][year]", "1992")
    .field("subjects[1][skills][0]", "Python")
    .field("subjects[1][skills][1]", "Flask")
    .field("subjects[1][skills][2]", "JavaScript")
    .field("subjects[1][skills][3]", "Babel")
    .field("subjects[1][skills][4]", "React")
    .field("subjects[1][skills][5]", "Redux")

  const expected = {
    subjects: [
      {
        firstName: "John",
        lastName: "Doe",
        dob: {
          day: 1,
          month: "Jan.",
          year: 1989
        },
        skills: ["Node.js", "CoffeeScript", "JavaScript", "Babel"]
      }, {
        firstName: "Max",
        lastName: "Doe",
        dob: {
          day: 12,
          month: "Mar.",
          year: 1992
        },
        skills: ["Python", "Flask", "JavaScript", "Babel", "React", "Redux"]
      }
    ]
  }

  t.deepEqual(body, expected)
})

test("Should support collections", async t => {
  const {body} = await request(mockServer(parse)())
    .post("/")
    .set("content-type", mockHeader)
    .field("[0][firstName]", "John")
    .field("[0][lastName]", "Doe")
    .field("[0][dob][day]", "1")
    .field("[0][dob][month]", "Jan.")
    .field("[0][dob][year]", "1989")
    .field("[0][skills][0]", "Node.js")
    .field("[0][skills][1]", "CoffeeScript")
    .field("[0][skills][2]", "JavaScript")
    .field("[0][skills][3]", "Babel")
    .field("[1][firstName]", "Max")
    .field("[1][lastName]", "Doe")
    .field("[1][dob][day]", "12")
    .field("[1][dob][month]", "Mar.")
    .field("[1][dob][year]", "1992")
    .field("[1][skills][0]", "Python")
    .field("[1][skills][1]", "Flask")
    .field("[1][skills][2]", "JavaScript")
    .field("[1][skills][3]", "Babel")
    .field("[1][skills][4]", "React")
    .field("[1][skills][5]", "Redux")

  const expected = [
    {
      firstName: "John",
      lastName: "Doe",
      dob: {
        day: 1,
        month: "Jan.",
        year: 1989
      },
      skills: ["Node.js", "CoffeeScript", "JavaScript", "Babel"]
    }, {
      firstName: "Max",
      lastName: "Doe",
      dob: {
        day: 12,
        month: "Mar.",
        year: 1992
      },
      skills: ["Python", "Flask", "JavaScript", "Babel", "React", "Redux"]
    }
  ]

  t.deepEqual(body, expected)
})

test("Should restore field type by default", async t => {
  const {body} = await request(mockServer(parse)())
    .post("/")
    .field("nullValue", "null")
    .field("falseValue", "false")
    .field("trueValue", "true")
    .field("numberValue", "42")
    .field("stringValue", "Some random string")

  const expected = {
    nullValue: null,
    falseValue: false,
    trueValue: true,
    numberValue: 42,
    stringValue: "Some random string"
  }

  t.deepEqual(body, expected)
})

test(
  "Should not restore field type when options.restoreTypes turned to false",
  async t => {
    const {body} = await request(mockServer(parse)({restoreTypes: false}))
      .post("/")
      .field("nullValue", "null")
      .field("falseValue", "false")
      .field("trueValue", "true")
      .field("numberValue", "42")
      .field("stringValue", "Some random string")

    const expected = {
      nullValue: "null",
      falseValue: "false",
      trueValue: "true",
      numberValue: "42",
      stringValue: "Some random string"
    }

    t.deepEqual(body, expected)
  }
)

test("Should just receive file", async t => {
  const dict = "/usr/share/dict/words"

  const {body} = await request(mockServer(parse)())
    .post("/")
    .attach("file", dict)

  const expected = String(await readFile(dict))

  t.is(body.file, expected)
})

test("Should receive files and fields at the same time", async t => {
  const {body} = await request(mockServer(parse)())
    .post("/")
    .field("message[sender]", "John Doe")
    .field("message[text]", "Whatever test message text")
    .field("message[attachments][0][description]", "Some test file")
    .attach("message[attachments][0][file]", __filename)

  const file = String(await readFile(__filename))

  const expected = {
    message: {
      sender: "John Doe",
      text: "Whatever test message text",
      attachments: [
        {
          description: "Some test file",
          file
        }
      ]
    }
  }

  t.deepEqual(body, expected)
})

test("Should throw an error when no request object given", async t => {
  const err = await t.throws(parse())

  t.true(err instanceof TypeError)
  t.is(
    err.message,
    "Request must be an instance of http.IncomingMessage. Received undefined"
  )
})

test(
  "Should throw an error when request object is not an http.IncomingMessage",
  async t => {
    const err = await t.throws(parse({}))

    t.true(err instanceof TypeError)
    t.is(
      err.message,
      "Request must be an instance of http.IncomingMessage. Received object"
    )
  }
)

test(
  "Should throw an error when given options is not a plain object",
  async t => {
    const err = await t.throws(
      parse(mockRequest(), "totally not a plain object")
    )

    t.true(err instanceof TypeError)
    t.is(err.message, "Options must be an object. Received string")
  }
)

test("Should response an error on incorrect field name format", async t => {
  const format = "some[totally[]][wrong]format[foo]"

  const req = request(mockServer(parse)())
    .post("/")
    .field(format, "You shall not pass!")

  const err = await t.throws(req)

  t.is(err.response.text, `Error: Unexpected field name format: ${format}`)
})

test(
  "Should response an error on incorrect field name format of given file",
  async t => {
    const format = "some[totally[]][wrong]format[foo]"

    const req = request(mockServer(parse)())
      .post("/")
      .attach(format, __filename)

    const err = await t.throws(req)

    t.is(err.response.text, `Error: Unexpected field name format: ${format}`)
  }
)

test("Should response with error when PARTS limit reached", async t => {
  const options = {
    limits: {
      parts: 1
    }
  }

  const req = request(mockServer(parse)(options))
    .post("/")
    .field("field", 42)
    .attach("file", __filename)

  const {status, response} = await t.throws(req)

  t.is(status, 413)
  t.is(
    response.text,
    "PartsLimitError: Limit reached: " +
    `Available up to ${options.limits.parts} parts.`
  )
})

test("Should response with error when FIELDS limit reached", async t => {
  const options = {
    limits: {
      fields: 1
    }
  }

  const req = request(mockServer(parse)(options))
    .post("/")
    .field("field", 42)
    .field("extra", 451)

  const {status, response} = await t.throws(req)

  t.is(status, 413)
  t.is(
    response.text,
    "FieldsLimitError: Limit reached: " +
    `Available up to ${options.limits.fields} fields.`
  )
})

test("Should response with error when FILES limit reached", async t => {
  const options = {
    limits: {
      files: 1
    }
  }

  const req = request(mockServer(parse)(options))
    .post("/")
    .attach("file1", __filename)
    .attach("file2", "/usr/share/dict/words")

  const {status, response} = await t.throws(req)

  t.is(status, 413)
  t.is(
    response.text,
    "FilesLimitError: Limit reached: " +
    `Available up to ${options.limits.files} files.`
  )
})

test("Should response with error when FILE SIZE limit reached", async t => {
  const options = {
    limits: {
      fileSize: 1000
    }
  }

  const req = request(mockServer(parse)(options))
    .post("/")
    .attach("file", __filename)

  const {status, response} = await t.throws(req)

  t.is(status, 413)
  t.is(
    response.text,
    "FileSizeLimitError: Limit reached: " +
    `Available up to ${options.limits.fileSize} bytes per file.`
  )
})

test("Should response with error when FIELD SIZE limit reached", async t => {
  const options = {
    limits: {
      fieldSize: 2
    }
  }

  const req = request(mockServer(parse)(options))
    .post("/")
    .field(
      "field", "I beat Twilight Sparkle and all I got was this lousy t-shirt."
    )

  const {status, response} = await t.throws(req)

  t.is(status, 413)
  t.is(
    response.text,
    "FieldSizeLimitError: Limit reached: " +
    `Available up to ${options.limits.fieldSize} bytes per field.`
  )
})
