import test from "ava"

import isPlainObject from "lodash.isplainobject"
import request from "supertest"

import {readFile} from "promise-fs"

import busboy from "lib/then-busboy"

import mockHeader from "test/helper/mockHeader"
import mockRequest from "test/helper/mockRequest"
import mockServer from "test/helper/mockServer"

test("Should return a Promise", t => {
  t.plan(1)

  const res = busboy(mockRequest)

  t.true(res instanceof Promise)

  mockRequest.emit("end")
})

test("Should just resolve a plain object", async t => {
  t.plan(1)

  const {body} = await request(mockServer(busboy)())
    .post("/")
    .set("content-type", mockHeader)

  t.true(isPlainObject(body))
})

test("Should return an expected object", async t => {
  t.plan(1)

  const {body} = await request(mockServer(busboy)())
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

test("Should restore field type by default", async t => {
  t.plan(1)

  const {body} = await request(mockServer(busboy)())
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
    t.plan(1)

    const {body} = await request(mockServer(busboy)({restoreTypes: false}))
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
  t.plan(1)

  const {body} = await request(mockServer(busboy)())
    .post("/")
    .attach("file", __filename)

  const expected = String(await readFile(__filename))

  t.is(body.file, expected)
})

test("Should throw an error when no request object given", async t => {
  t.plan(3)

  const err = await t.throws(busboy())

  t.true(err instanceof TypeError)
  t.is(
    err.message,
    "Request should be an instanceof http.IncomingMessage. Received undefined"
  )
})

test(
  "Should throw an error when request object is not an http.IncomingMessage",
  async t => {
    t.plan(3)

    const err = await t.throws(busboy({}))

    t.true(err instanceof TypeError)
    t.is(
      err.message,
      "Request should be an instanceof http.IncomingMessage. Received object"
    )
  }
)

test(
  "Should throw an error when given options is not a plain object",
  async t => {
    t.plan(3)

    const err = await t.throws(
      busboy(mockRequest, "totally not a plain object")
    )

    t.true(err instanceof TypeError)
    t.is(err.message, "Options should be an object. Received string")
  }
)

test(
  "Should response with an error when assignin a property to primitive value",
  async t => {
    t.plan(1)

    const {error} = await request(mockServer(busboy)())
      .post("/")
      .field("root[0]", "whatever")
      .field("root[0][nop]", "oops")

    t.is(
      error.text,
      "TypeError: Cannot create property 'nop' on string 'whatever'"
    )
  }
)

test("Should response an error on incorrect field name format", async t => {
  t.plan(1)

  const format = "some[totally[]][wrong]format[foo]"

  const {error} = await request(mockServer(busboy)({foo: "foo"}))
    .post("/")
    .field(format, "You shall not pass!")

  t.is(error.text, `Error: Unexpected name format of the field: ${format}`)
})

test("Should response an error on incorrect field name format of given file",
  async t => {
    t.plan(1)

    const format = "some[totally[]][wrong]format[foo]"

    const {error} = await request(mockServer(busboy)({foo: "foo"}))
      .post("/")
      .attach(format, __filename)

    t.is(error.text, `Error: Unexpected name format of the field: ${format}`)
  }
)
