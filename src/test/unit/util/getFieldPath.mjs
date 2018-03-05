import test from "ava"

import getFieldPath from "../../../lib/util/getFieldPath"

test("Should return an array with one element", t => {
  t.plan(2)

  const path = getFieldPath("someElement")

  t.is(path.length, 1)
  t.deepEqual(path, ["someElement"])
})

test("Should resolve more complex path", t => {
  t.plan(1)

  const expected = ["stories", 1, "chapters", 42]

  const actual = getFieldPath("stories[1][chapters][42]")

  t.deepEqual(actual, expected)
})

test("Should throw an error when field name is not a string", t => {
  t.plan(3)

  const trap = () => getFieldPath({})

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "Field name should be a string. Received object")
})

test("Should throw a TypeError on invocation without any arguments", t => {
  t.plan(3)

  const trap = () => getFieldPath()

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "Field name should be a string. Received undefined")
})

test("Should throw an error when given field name is empty string", t => {
  t.plan(1)

  const trap = () => getFieldPath("")

  t.throws(trap, "Field name cannot be empty.")
})

test("Should throw a TypeError on unallowed field name format", t => {
  t.plan(2)

  const format = "some[totally[]][wrong]format"

  const trap = () => getFieldPath(format)

  const err = t.throws(trap)

  t.is(err.message, `Unexpected name format of the field: ${format}`)
})
