import test from "ava"
import FormData from "formdata-node"

import Body from "../../lib/Body"
import isPlainObject from "../../lib/util/isPlainObject"

// const dict = "/usr/share/dict/words"

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

test(
  "Body.formData() should return a FormData for given body instance",
  t => {
    t.plan(1)

    const body = new Body([])

    t.true(isPlainObject(Body.json(body)))
  }
)

test("Body.from() should create an instance", t => {
  t.plan(1)

  t.true(Body.from([]) instanceof Body)
})

test("Body.entries should contain entries passed to Body.from()", t => {
  t.plan(1)

  const expected = [[["key"], {value: "value"}]]

  t.deepEqual(Body.from(expected).entries, expected)
})
