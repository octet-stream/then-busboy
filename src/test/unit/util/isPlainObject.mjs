import test from "ava"

import isPlainObject from "lib/util/isPlainObject"

test("Should return a boolean value", t => {
  t.is(typeof isPlainObject(), "boolean")

  t.true(isPlainObject({}))
  t.false(isPlainObject("I am waiting for you last summer"))
})

test(
  "Should return false when passed non-object value, " +
  "like some primitives of their constructors",
  t => {
    t.false(isPlainObject(null))
    t.false(isPlainObject(undefined))
    t.false(isPlainObject(void 0))

    t.false(isPlainObject(0))
    t.false(isPlainObject(42))
    t.false(isPlainObject(new Number(2319))) // eslint-disable-line

    t.false(isPlainObject("Some whatever string"))

    // eslint-disable-next-line
    t.false(isPlainObject(new String("Some whatever string")))
  }
)

test("Should return false when passed Array or RegExp", t => {
  t.false(isPlainObject([]))
  t.false(isPlainObject(new Array())) // eslint-disable-line

  t.false(isPlainObject(/.*/))
  t.false(isPlainObject(new RegExp("/.*/")))
})

test(
  "Should return true when passed an object literal or Object.create(null)",
  t => {
    t.true(isPlainObject({}))
    t.true(isPlainObject(Object.create(null)))
    t.true(isPlainObject(new Object({key: "value"}))) // eslint-disable-line
  }
)
