import test from "ava"

import isPlainObject from "lodash.isplainobject"

import objectFromEntries from "lib/util/objectFromEntries"

test("Should always return a plain object when array given", t => {
  t.plan(1)

  const actual = objectFromEntries([])

  t.true(isPlainObject(actual))
})

test("Should correctly resolve simple (flat) object", t => {
  t.plan(1)

  const expected = {
    name: "John Doe",
    age: 25,
    gender: "Male"
  }

  const actual = objectFromEntries([
    [
      ["name"], "John Doe"
    ],
    [
      ["age"], 25
    ],
    [
      ["gender"], "Male"
    ]
  ])

  t.deepEqual(actual, expected)
})
