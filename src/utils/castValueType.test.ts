import test from "ava"

import {castValueType} from "./castValueType.js"

test("Should restore null value", t => {
  t.is(castValueType("null"), null)
})

test("Should restore undefined value", t => {
  t.is(castValueType("undefined"), undefined)
})

test("Should restore true value", t => {
  t.is(castValueType("true"), true)
})

test("Should restore false value", t => {
  t.is(castValueType("false"), false)
})

test("Should restore Number value", t => {
  t.is(castValueType("451"), 451)
})

test("Should restore whatever string value as is", t => {
  t.is(
    castValueType("In Soviet Moon landscape see binocular through YOU."),

    "In Soviet Moon landscape see binocular through YOU."
  )
})
