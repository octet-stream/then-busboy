import {inspect} from "node:util"

import test from "ava"

import {BodyField, BodyFieldOptions} from "./BodyField.js"

test("Creates a new BodyField", t => {
  const field = new BodyField("Some value", "field")

  t.true(field instanceof BodyField)
})

test("Has correct name property", t => {
  const field = new BodyField("Some value", "field")

  t.is(field.name, "field")
})

test("Has correct value returned by .valueOf()", t => {
  const field = new BodyField("Some value", "field")

  t.is(field.valueOf(), "Some value")
})

test(".valueOf() returns a value without conversion", t => {
  const expected = 42

  t.is(new BodyField(expected, "field").valueOf(), 42)
})

test("Can be casted to a number using builtin Number object", t => {
  t.is(Number(new BodyField("42", "field")), 42)
})

test("Can be conveted to a string using builtin String object", t => {
  t.is(String(new BodyField(42, "field")), "42")
})

test("Takes options as the 3rd argument", t => {
  const expected: BodyFieldOptions = {
    enc: "8bit",
    fieldnameTruncated: false,
    valueTruncated: false,
    type: "text/plain"
  }

  const field = new BodyField("Some value", "field", expected)

  t.is(field.enc, expected.enc)
  t.is(field.fieldnameTruncated, expected.fieldnameTruncated)
  t.is(field.valueTruncated, expected.valueTruncated)
  t.is(field.type, expected.type)
})

test("Inspect returns correct value", t => {
  t.is(inspect(new BodyField(42, "field")), "[BodyField: 42]")
})
