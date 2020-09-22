const test = require("ava")

const getFieldPath = require("../../../lib/util/getFieldPath")

test("Should return an array with one element", t => {
  const path = getFieldPath("someElement")

  t.is(path.length, 1)
  t.deepEqual(path, ["someElement"])
})

test("Should resolve complex path", t => {
  const expected = ["stories", 1, "chapters", 42, "title"]

  const actual = getFieldPath("stories[1][chapters][42][title]")

  t.deepEqual(actual, expected)
})

test("Should support collections on top-level of path", t => {
  const expected = [0, "name"]

  const actual = getFieldPath("[0][name]")

  t.deepEqual(actual, expected)
})

test("Should support paths with dot notaiton", t => {
  const expected = ["user", "name"]

  const actual = getFieldPath("user.name")

  t.deepEqual(actual, expected)
})

test("Should support collections in dot notation paths", t => {
  const expected = ["user", "stories", 42, "title"]

  const actual = getFieldPath("user.stories.42.title")

  t.deepEqual(actual, expected)
})

test("Should support top-level collections with dot notation", t => {
  const expected = [0, "name"]

  const actual = getFieldPath("0.name")

  t.deepEqual(actual, expected)
})

test("Should throw an error when given field name is empty string", t => {
  const trap = () => getFieldPath("")

  t.throws(trap, {message: "Field name cannot be empty."})
})

test("Should throw a TypeError on unallowed field name format", t => {
  const format = "some[totally[]][wrong]format"

  const trap = () => getFieldPath(format)

  const err = t.throws(trap)

  t.is(err.message, `Unexpected field name format: ${format}`)
})
