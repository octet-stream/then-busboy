import test from "ava"

import {BodyField, BodyFieldOptions} from "./BodyField"

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
