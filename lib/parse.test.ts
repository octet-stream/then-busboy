import test from "ava"

import {FormData, File} from "formdata-node"

import createRequest from "./__helper__/createRequest"
import createServer from "./__helper__/createServer"

import {parse} from "./parse"

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

  Object.entries(expected)
    .forEach(([name, value]) => form.set(name, String(value)))

  const {body} = await createRequest(
    createServer(parse, {castTypes: false}),

    form
  )

  t.deepEqual(body, expected)
})

// test("Parses a File", async t => {
//   const expected = "My hovercraft is full of eels"

//   const form = new FormData()

//   form.set("file", new File([expected], "file.txt"))

//   const res = await createRequest(createServer(parse), form)

//   t.deepEqual(res.body, {file: expected})
// })
