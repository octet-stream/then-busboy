import test from "ava"

import cast from "./castType"

test("Should restore null value", t => {
  t.is(cast("null"), null)
})

test("Should restore undefined value", t => {
  t.is(cast("undefined"), undefined)
})

test("Should restore true value", t => {
  t.is(cast("true"), true)
})

test("Should restore false value", t => {
  t.is(cast("false"), false)
})

test("Should restore Number value", t => {
  t.is(cast("451"), 451)
})

test("Should restore whatever string value as is", t => {
  t.is(
    cast("In Soviet Moon landscape see binocular through YOU."),

    "In Soviet Moon landscape see binocular through YOU."
  )
})
