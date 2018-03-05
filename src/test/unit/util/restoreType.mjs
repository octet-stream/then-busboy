import test from "ava"

import restoreType from "../../../lib/util/restoreType"

test("Should restore null value", t => {
  t.plan(1)

  t.is(restoreType("null"), null)
})

test("Should restore undefined value", t => {
  t.plan(1)

  t.is(restoreType("undefined"), undefined)
})

test("Should restore true value", t => {
  t.plan(1)

  t.is(restoreType("true"), true)
})

test("Should restore false value", t => {
  t.plan(1)

  t.is(restoreType("false"), false)
})

test("Should restore Number value", t => {
  t.plan(1)

  t.is(restoreType("451"), 451)
})

test("Should restore whatever string value as is", t => {
  t.plan(1)

  t.is(
    restoreType("In Soviet Moon landscape see binocular through YOU."),
    "In Soviet Moon landscape see binocular through YOU."
  )
})
