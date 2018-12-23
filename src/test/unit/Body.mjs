import {createReadStream} from "fs"

import {spy} from "sinon"

import test from "ava"
import FormData from "formdata-node"

import File from "../../lib/File"
import Body from "../../lib/Body"
import isPlainObject from "../../lib/util/isPlainObject"

const dict = "/usr/share/dict/words"

test("Body.json() should return a plain object for given entries", t => {
  t.plan(1)

  t.true(isPlainObject(Body.json([])))
})

test("Body.json() should return a plain object for given body instance", t => {
  t.plan(1)

  const body = new Body([])

  t.true(isPlainObject(Body.json(body)))
})

test("Body.json() should take an entries array and then return object", t => {
  t.plan(1)

  t.true(isPlainObject(Body.json([])))
})

test("Body.json() should return an expected object", t => {
  t.plan(1)

  const expected = {key: "value"}

  t.deepEqual(Body.json([[["key"], {value: "value"}]]), expected)
})

test("Body.formData() should return a FormData for given entries", t => {
  t.plan(1)

  const body = new Body([])

  t.true(Body.formData(body) instanceof FormData)
})

test(
  "Body.formData() should take an entries array and then return FormData",
  t => {
    t.plan(1)

    t.true(Body.formData([]) instanceof FormData)
  }
)

test("Created FormData should contain all entries", t => {
  t.plan(4)

  const file = new File({
    contents: createReadStream(dict),
    filename: "dictionary",
    mime: "text/plain",
    enc: "utf8"
  })

  const expected = [
    [["field"], {value: "some text"}],
    [["file"], file]
  ]

  const fd = Body.formData(expected)

  t.true(fd.has("field"))
  t.is(fd.get("field"), "some text")

  t.true(fd.has("file"))
  t.is(fd.get("file"), file.stream)
})

test("Body.from() should create an instance", t => {
  t.plan(1)

  t.true(Body.from([]) instanceof Body)
})

test("Body.entries() should contain entries passed to Body.from()", t => {
  t.plan(1)

  const file = new File({
    contents: createReadStream(dict),
    filename: "dictionary",
    mime: "text/plain",
    enc: "utf8"
  })

  const expected = [
    [["field"], {value: "some text"}],
    [["file"], file]
  ]

  t.deepEqual(Body.from(expected).entries(), expected)
})

test("Body#files getter should return a Body with files only", t => {
  t.plan(2)

  const file = new File({
    contents: createReadStream(dict),
    filename: "dictionary",
    mime: "text/plain",
    enc: "utf8"
  })

  const files = [[["file"], file]]
  const entries = [[["field"], {value: "some text"}], ...files]

  const body = Body.from(entries).files

  t.true(body instanceof Body)
  t.deepEqual(body.entries(), files)
})

test("Body#fields getter should return a Body with fields only", t => {
  t.plan(2)

  const file = new File({
    contents: createReadStream(dict),
    filename: "dictionary",
    mime: "text/plain",
    enc: "utf8"
  })

  const fields = [[["field"], {value: "some text"}]]
  const entries = [[["file"], file], ...fields]

  const body = Body.from(entries).fields

  t.true(body instanceof Body)
  t.deepEqual(body.entries(), fields)
})

test("Body#length should return current amount of entries in Body", t => {
  t.plan(2)

  const file = new File({
    contents: createReadStream(dict),
    filename: "dictionary",
    mime: "text/plain",
    enc: "utf8"
  })

  const entries = [
    [["field"], {value: "some text"}],
    [["file"], file]
  ]

  t.is(Body.from([]).length, 0)
  t.is(Body.from(entries).length, 2)
})

test("Body iterators should not execute callback on empty body", t => {
  t.plan(3)

  const forEachFulfill = spy()
  const filterFulfill = spy()
  const mapFulfill = spy()

  Body.from([]).forEach(forEachFulfill)
  Body.from([]).filter(filterFulfill)
  Body.from([]).map(mapFulfill)

  t.false(forEachFulfill.called)
  t.false(filterFulfill.called)
  t.false(mapFulfill.called)
})

test("Body iterators assign null as callback ctx by default", t => {
  t.plan(3)

  const entries = [
    [["field"], {value: "some text"}]
  ]

  const forEachFulfill = spy()
  const filterFulfill = spy()
  const mapFulfill = spy()

  Body.from(entries).forEach(forEachFulfill)
  Body.from(entries).filter(filterFulfill)
  Body.from(entries).map(mapFulfill)

  t.is(forEachFulfill.firstCall.thisValue, null)
  t.is(filterFulfill.firstCall.thisValue, null)
  t.is(mapFulfill.firstCall.thisValue, null)
})

test("Body iterators should execute callback with correct arguments", t => {
  t.plan(3)

  const entries = [[["field"], {value: "some text"}]]
  const expected = [{value: "some text"}, "field", ["field"], entries]

  const forEachFulfill = spy()
  const filterFulfill = spy()
  const mapFulfill = spy()

  Body.from(entries).forEach(forEachFulfill)
  Body.from(entries).filter(filterFulfill)
  Body.from(entries).map(mapFulfill)

  t.deepEqual(forEachFulfill.firstCall.args, expected)
  t.deepEqual(filterFulfill.firstCall.args, expected)
  t.deepEqual(mapFulfill.firstCall.args, expected)
})

test(
  "Body[Symbol.iterator] is a method and should allow to go through values",
  t => {
    t.plan(2)

    const entries = [[["field"], {value: "some text"}]]
    const body = Body.from(entries)

    t.is(typeof body[Symbol.iterator], "function")
    t.deepEqual(body[Symbol.iterator]().next().value, {value: "some text"})
  }
)

test("Body#values allows to go through values", t => {
  t.plan(1)

  const entries = [[["field"], {value: "some text"}]]
  const body = Body.from(entries)

  t.deepEqual(body.values().next().value, {value: "some text"})
})

test("Body#names allows to go through names", t => {
  t.plan(1)

  const entries = [[["field"], {value: "some text"}]]
  const body = Body.from(entries)

  t.deepEqual(body.names().next().value, "field")
})

test("Body#paths allows to go through paths", t => {
  t.plan(1)

  const entries = [[["field"], {value: "some text"}]]
  const body = Body.from(entries)

  t.deepEqual(body.paths().next().value, ["field"])
})
