import {Readable} from "stream"

import test from "ava"

import {isAsyncIterable} from "./isAsyncIterable"

test("Returns false for null", t => {
  t.false(isAsyncIterable(null))
})

test("Returns false for undefined", t => {
  t.false(isAsyncIterable(undefined))
})

test("Returns true for Readable stream", t => {
  t.true(isAsyncIterable(Readable.from([])))
})

test("Return true for an object with callable @@asyncIterator property", t => {
  async function* source() { /* noop */ }

  t.true(isAsyncIterable({[Symbol.asyncIterator]: source}))
})

test("Return true for async generator", t => {
  async function* source() { /* noop */ }

  t.true(isAsyncIterable(source()))
})
