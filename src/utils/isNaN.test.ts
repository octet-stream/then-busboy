import test from "ava"

import {isNaN} from "./isNaN.js"

test("Returns true for NaN value", t => {
  t.true(isNaN(NaN))
})

test("Returns true for non-numeric string", t => {
  t.true(isNaN("son non-numeric string"))
})

test("Returns false for numeric string", t => {
  t.false(isNaN("42"))
})

test("Returns false for a number", t => {
  t.false(isNaN(42))
})
